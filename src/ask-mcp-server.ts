import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import http from 'http';
import { createHash, randomBytes } from 'crypto';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// OAuth helper functions
const generateCodeVerifier = () => {
  return randomBytes(32).toString('base64url');
};

const generateCodeChallenge = (verifier: string) => {
  return createHash('sha256').update(verifier).digest('base64url');
};

const saveConfig = (apiKey: string) => {
  const configPath = path.join(__dirname, '..', '.env.local');
  const config = `# Ask MCP Tool Configuration\nOPENROUTER_API_KEY=${apiKey}\n`;
  fs.writeFileSync(configPath, config);
  console.log(`✅ Configuration saved to ${configPath}`);
};

const question = (prompt: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export class AskMCPServer {
  private server: Server;
  private openRouterApiKey: string;
  private oauthSetupPromise: Promise<void> | null = null;

  constructor() {
    this.server = new Server({
      name: 'ask-mcp',
      version: '1.0.0',
    });

    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    
    if (!this.openRouterApiKey) {
      console.log('🔑 No OpenRouter API key found. Starting OAuth setup...');
      this.oauthSetupPromise = this.setupOAuth();
    }

    this.setupToolHandlers();
  }

  private async setupOAuth(): Promise<void> {
    const PORT = 8080;
    const REDIRECT_URI = `http://localhost:${PORT}`;
    
    try {
      await question('Press ENTER to authenticate with OpenRouter (browser will open automatically)...');
      
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);
      
      return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
          const url = new URL(req.url!, REDIRECT_URI);
          const code = url.searchParams.get('code');
          
          if (code) {
            res.end('<h1>Authentication successful!</h1><p>You can close this window and return to your terminal.</p>');
            server.close();
            console.log('\n✅ Authentication successful!');
            console.log('🔄 Exchanging authorization code for API key...');
            
            try {
              const response = await fetch('https://openrouter.ai/api/v1/auth/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  code: code,
                  code_verifier: codeVerifier,
                  code_challenge_method: 'S256'
                })
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to exchange code: ${response.status} ${errorText}`);
              }
              
              const { key } = await response.json();
              this.openRouterApiKey = key;
              saveConfig(key);
              
              console.log('\n🎉 OAuth setup complete!');
              console.log('✅ API key configured and ready to use!');
              resolve();
            } catch (e) {
              console.error('❌ OAuth setup failed during code exchange:', e instanceof Error ? e.message : 'Unknown error');
              reject(e);
            }
          } else {
            res.end('<h1>Waiting for authentication...</h1><p>Please complete the authentication in the opened browser tab.</p>');
          }
        }).listen(PORT, async () => {
          const authUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
          
          console.log('\n🔐 Opening your browser for OpenRouter authentication...');
          console.log('If your browser does not open, please copy and paste this URL:');
          console.log(authUrl);
          await open(authUrl);
          console.log(`\n👂 Waiting for authentication callback on port ${PORT}...`);
        });
      });
    } catch (error) {
      console.error('❌ OAuth setup failed:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
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

      // Wait for OAuth setup if it's in progress
      if (this.oauthSetupPromise) {
        await this.oauthSetupPromise;
        this.oauthSetupPromise = null;
      }
      
      if (!this.openRouterApiKey) {
        throw new Error('OpenRouter API key not configured. Please restart the server to set up authentication.');
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