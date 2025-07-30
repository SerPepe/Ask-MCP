# Ask MCP 🤖

[![npm version](https://badge.fury.io/js/ask-mcp.svg)](https://badge.fury.io/js/ask-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Add to Cursor](https://img.shields.io/badge/Add%20to-Cursor-blue?logo=cursor&logoColor=white)](https://docs.cursor.com/en/context/mcp)

A powerful Model Context Protocol (MCP) server that provides seamless access to multiple state-of-the-art AI models through OpenRouter. Perfect for integration with Cursor, Claude Desktop, and other MCP-compatible clients.

## ✨ Features

- 🎯 **5 Premium AI Models**: Grok, Gemini 2.5 Pro, Kimi, Qwen3 Coder, GLM-4.5
- 💰 **Free Tier Support**: Access free variants when available
- 🔐 **OAuth Authentication**: Secure OpenRouter integration
- 🚀 **Easy Setup**: One-command OAuth configuration
- 🔌 **MCP Compatible**: Works with Cursor, Claude Desktop, and more
- 📦 **TypeScript**: Full type safety and modern development

## Supported Models

- **Grok**: Advanced reasoning and analysis (x-ai/grok-4)
- **Gemini 2.5 Pro**: Google's latest multimodal AI (google/gemini-2.5-pro)
- **Kimi**: Efficient and fast responses (moonshotai/kimi-k2)
- **Qwen 3 Coder**: Specialized for coding tasks (qwen/qwen3-coder)
- **GLM**: General language model (z-ai/glm-4.5)

### Free Model Variants

The tool supports free model variants for cost-effective usage:
- **Kimi Free**: moonshotai/kimi-k2:free
- **Qwen Free**: qwen/qwen3-coder:free
- **GLM Free**: z-ai/glm-4.5-air:free

Free models are automatically used as fallback when payment errors occur, or can be explicitly requested using the `free` parameter.

## Installation

### Option 1: NPM Package (Recommended)

```bash
npm install -g ask-mcp
```

### Option 2: From Source

1. Clone this repository:
```bash
git clone https://github.com/SerPepe/Ask-MCP
cd ask-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Option 3: Use Hosted Service

You can use our hosted MCP server instead of running it locally. See the "Hosted Service" section below.

## Quick Start

### Option 1: OAuth Setup (Recommended)
```bash
1. Clone the repository
2. Install dependencies: npm install
3. Run OAuth setup: npm run setup
4. Follow the interactive prompts to authenticate
5. Test the server: npm test
```

### Option 2: Manual API Key Setup
```bash
1. Clone the repository
2. Install dependencies: npm install
3. Build the project: npm run build
4. Set your OpenRouter API key: export OPENROUTER_API_KEY="your-key-here"
5. Test the server: npm test
```

## Configuration

### Authentication Options

The Ask MCP tool supports two authentication methods:

#### Option 1: API Key Authentication (Recommended)

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add credits to your account
4. Set the `OPENROUTER_API_KEY` environment variable

#### Option 2: OAuth Authentication

1. Use the built-in OAuth flow for secure authentication
2. Generate authorization URLs and exchange codes for API keys
3. Perfect for applications requiring user consent

### Configure MCP Client

#### For Cursor IDE

**Option A: Using NPM Package**
```json
{
  "mcpServers": {
    "ask-mcp": {
      "command": "ask-mcp",
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-api-key-here"
      }
    }
  }
}
```

**Option B: Using Local Build**
```json
{
  "mcpServers": {
    "ask-mcp": {
      "command": "node",
      "args": ["/path/to/ask-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-api-key-here"
      }
    }
  }
}
```

**Option C: Using Hosted Service**
```json
{
  "mcpServers": {
    "ask-mcp": {
      "command": "npx",
      "args": ["ask-mcp-client", "--host", "https://your-hosted-service.com"],
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-api-key-here"
      }
    }
  }
}
```

#### For Claude Desktop

Same configuration options as above work for Claude Desktop.

## Usage

Once configured, you can use the following commands in your MCP client:

### Ask Grok
```
ask-grok "What is the latest in AI development?"
```

### Ask Gemini
```
ask-gemini "Explain quantum computing in simple terms"
```

### Ask Kimi
```
ask-kimi "Write a Python function to sort a list"
```

### Ask Qwen
```
ask-qwen "Debug this JavaScript code: console.log('hello world')"
```

### Ask GLM
```
ask-glm "Translate this to Spanish: Hello, how are you?"
```

Each model has specific strengths:
- Use **Grok** for complex reasoning and analysis
- Use **Gemini** for multimodal tasks (text + images)
- Use **Kimi** for quick, efficient responses
- Use **Qwen** for coding and technical tasks
- Use **GLM** for general language tasks

### Smart Fallback System

The tool includes intelligent error handling:
1. **Automatic Fallback**: When payment/quota errors occur, the tool automatically retries with free model variants
2. **Manual Free Mode**: Use the `free: true` parameter to directly use free models
3. **Error Recovery**: Comprehensive error messages help diagnose issues

### With System Prompt

You can also provide a custom system prompt:

```
ask-grok {
  "question": "What's the weather like?",
  "system_prompt": "You are a helpful weather assistant. Always ask for location if not provided."
}
```

### Using Free Models

You can explicitly use free model variants:

```
ask-kimi {
  "question": "What is machine learning?",
  "free": true
}
```

## Usage Examples

### Basic Usage
```json
{
  "name": "ask-grok",
  "arguments": {
    "question": "Explain quantum computing"
  }
}
```

### With Custom System Prompt
```json
{
  "name": "ask-gemini",
  "arguments": {
    "question": "Write a Python function to sort a list",
    "system_prompt": "You are a senior Python developer. Provide clean, well-documented code."
  }
}
```

### Using Free Models
```json
{
  "name": "ask-kimi",
  "arguments": {
    "question": "What is machine learning?",
    "free": true
  }
}
```

### GLM Model Usage
```json
{
  "name": "ask-glm",
  "arguments": {
    "question": "Translate this to Spanish: Hello, how are you?",
    "system_prompt": "You are a professional translator."
  }
}
```

## OAuth Authentication

The Ask MCP tool includes built-in OAuth support for secure authentication with OpenRouter.

### OAuth Tools

#### Generate Authorization URL
```json
{
  "name": "openrouter-auth-url",
  "arguments": {
    "redirect_uri": "http://localhost:8080/callback",
    "state": "optional-security-state"
  }
}
```

#### Exchange Authorization Code
```json
{
  "name": "openrouter-exchange-code",
  "arguments": {
    "code": "authorization-code-from-callback",
    "state": "optional-security-state"
  }
}
```

### OAuth Flow

1. **Generate Authorization URL**: Use `openrouter-auth-url` to get the OAuth URL
2. **User Authorization**: Visit the URL and authorize the application
3. **Get Authorization Code**: Copy the code from the callback URL
4. **Exchange Code**: Use `openrouter-exchange-code` to get your API key
5. **Save API Key**: Set the returned API key as `OPENROUTER_API_KEY`

### OAuth Environment Variables

```bash
# Optional OAuth configuration
export OPENROUTER_CLIENT_ID="your-client-id"          # Optional
export OPENROUTER_CLIENT_SECRET="your-client-secret"  # Optional
export OPENROUTER_REDIRECT_URI="http://localhost:8080/callback"  # Default provided
```

## Deployment

### Cloudflare Workers (Recommended)

Deploy to Cloudflare Workers with Container support for scalable hosting:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy container
wrangler deploy
```

**Benefits:**
- ✅ Serverless scaling
- ✅ Global edge deployment
- ✅ Cost-effective (Workers Paid plan)
- ✅ Built-in container support

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker Deployment

```bash
# Build container
docker build -t ask-mcp .

# Run container
docker run -p 3000:3000 -e OPENROUTER_API_KEY="your-key" ask-mcp
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Hosted Service

For users who prefer not to run the MCP server locally, we provide a hosted service option.

### Benefits of Hosted Service
- No local installation required
- Always up-to-date with latest features
- Reduced resource usage on your machine
- Automatic scaling and reliability

### Using Hosted Service

1. **Get the hosted endpoint**: Contact us for the hosted service URL
2. **Configure your MCP client** to use the hosted endpoint
3. **Add your OpenRouter API key** in the configuration

### Self-Hosting with Docker

You can also host your own instance using Docker:

```bash
# Clone the repository
git clone https://github.com/SerPepe/Ask-MCP
cd ask-mcp

# Build and run with Docker Compose
docker-compose up -d
```

The service will be available at `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **"OpenRouter API key not configured"**
   - Make sure you've set the `OPENROUTER_API_KEY` environment variable
   - Check that your API key is valid and has credits

2. **"No response received from the model"**
   - Check your OpenRouter account has sufficient credits
   - Verify the model is available on OpenRouter

3. **Connection issues**
   - Ensure you have internet connectivity
   - Check if OpenRouter API is accessible from your network

4. **NPM package issues**
   - Try reinstalling: `npm uninstall -g ask-mcp && npm install -g ask-mcp`
   - Check Node.js version (requires Node.js 16+)

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.