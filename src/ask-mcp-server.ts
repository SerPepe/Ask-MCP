import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Model configurations
const MODELS = {
  grok: 'x-ai/grok-4',
  gemini: 'google/gemini-2.5-pro',
  kimi: 'moonshotai/kimi-k2',
  qwen: 'qwen/qwen3-coder',
  glm: 'z-ai/glm-4.5'
} as const;

const FREE_MODELS = {
  kimi: 'moonshotai/kimi-k2:free',
  qwen: 'qwen/qwen3-coder:free',
  glm: 'z-ai/glm-4.5-air:free'
} as const;

type ModelKey = keyof typeof MODELS;
type ModelName = typeof MODELS[keyof typeof MODELS] | typeof FREE_MODELS[keyof typeof FREE_MODELS];

interface AskRequest {
  question: string;
  system_prompt?: string;
  free?: boolean;
}

export class AskMCPServer {
  private server: Server;
  private openRouterApiKey: string;

  constructor() {
    this.server = new Server({
      name: 'ask-mcp',
      version: '1.0.0',
    });

    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.openRouterApiKey) {
      console.error('Warning: OPENROUTER_API_KEY environment variable not set');
    }

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        // Model query tools
        ...Object.keys(MODELS).map(modelName => ({
          name: `ask-${modelName}`,
          description: `Ask ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} AI model a question through OpenRouter`,
          inputSchema: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The question or prompt to send to the AI model'
              },
              system_prompt: {
                type: 'string',
                description: 'Optional system prompt to guide the AI response',
                default: 'You are a helpful AI assistant.'
              },
              free: {
                type: 'boolean',
                description: 'Use free model variant when available',
                default: false
              }
            },
            required: ['question']
          }
        }))
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;
      
      // Extract model name from tool name (e.g., "ask-grok" -> "grok")
      const modelName = name.replace('ask-', '') as ModelKey;
      
      if (!MODELS[modelName]) {
        throw new Error(`Unknown model: ${modelName}`);
      }

      if (!this.openRouterApiKey) {
        throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.');
      }

      const { question, system_prompt = 'You are a helpful AI assistant.', free = false } = args as unknown as AskRequest;

      try {
        // Determine which model to use based on free parameter
         let selectedModel: ModelName = MODELS[modelName];
         if (free && FREE_MODELS[modelName as keyof typeof FREE_MODELS]) {
           selectedModel = FREE_MODELS[modelName as keyof typeof FREE_MODELS];
         }
         
         const response = await this.queryOpenRouter(selectedModel, question, system_prompt);
        
        return {
          content: [
            {
              type: 'text',
              text: `**${modelName.charAt(0).toUpperCase() + modelName.slice(1)} Response:**\n\n${response}`
            }
          ]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const isPaymentError = errorMessage.includes('insufficient') || 
                              errorMessage.includes('credit') || 
                              errorMessage.includes('payment') ||
                              errorMessage.includes('402') ||
                              errorMessage.includes('billing');

        if (isPaymentError) {
          return {
            content: [
              {
                type: 'text',
                text: 'A 402 Payment Required error occurred. Please check your OpenRouter account balance or payment method.'
              }
            ]
          };
        }

        throw error;
      }
    });
  }

  private async queryOpenRouter(model: ModelName, prompt: string, systemPrompt: string): Promise<string> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  public async listen() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  public async handleAsk(query: string, system_prompt?: string, free?: boolean): Promise<string> {
    const modelName = 'grok'; // Or some other default
    let selectedModel: ModelName = MODELS[modelName];
    if (free && FREE_MODELS[modelName as keyof typeof FREE_MODELS]) {
      selectedModel = FREE_MODELS[modelName as keyof typeof FREE_MODELS];
    }
    return this.queryOpenRouter(selectedModel, query, system_prompt || 'You are a helpful AI assistant.');
  }
}