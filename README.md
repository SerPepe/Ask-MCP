# Ask MCP 🤖

[![npm version](https://badge.fury.io/js/ask-mcp.svg)](https://badge.fury.io/js/ask-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Add to Cursor](https://img.shields.io/badge/Add%20to-Cursor-blue?logo=cursor&logoColor=white)](cursor://anysphere.cursor-deeplink/mcp/install?name=ask-mcp&config=eyJhc2stbWNwIjp7ImNvbW1hbmQiOiJhc2stbWNwIiwiZW52Ijp7Ik9QRU5ST1VURVJfQVBJX0tFWSI6InlvdXItb3BlbnJvdXRlci1hcGkta2V5LWhlcmUifX19)

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

**First-time setup**: After installation, you'll need to authenticate with OpenRouter. You can either:
1. Set your API key: `export OPENROUTER_API_KEY="your-key-here"`
2. Or use OAuth setup (from source): `npm run setup` and press ENTER when prompted

### Option 2: From Source Installation

1. **Clone and install:**
   ```bash
   git clone https://github.com/SerPepe/Ask-MCP
   cd ask-mcp
   npm install
   npm run build
   ```

2. **Configure in your MCP client** (see Configuration section below)

3. **First-time setup:**
   When you first use the MCP server, it will automatically prompt for OAuth authentication. You can also run the setup manually:
   ```bash
   npm run setup
   ```


## Quick Start

### Option 1: NPM Installation (Recommended)
```bash
1. Install globally: npm install -g ask-mcp
2. Configure in your MCP client (Cursor/Claude Desktop)
3. First-time setup: When you first use the MCP server, it will automatically detect the missing API key and prompt you to authenticate with OpenRouter via OAuth. Simply press ENTER when prompted, and your browser will open automatically for secure authentication.
4. Start using the AI models!
```

### Option 2: From Source with OAuth Setup (Auto-Authentication)
```bash
1. Clone the repository
2. Install dependencies: npm install
3. Run OAuth setup: npm run setup
4. Press ENTER when prompted (browser will auto-open for OpenRouter OAuth)
5. Complete authentication in browser
6. Test the server: npm test
```

### Option 3: Manual API Key Setup
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

**Option A: Using NPM Package (Recommended)**
```json
{
  "mcpServers": {
    "ask-mcp": {
      "command": "ask-mcp"
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
      "args": ["/path/to/ask-mcp/dist/index.js"]
    }
  }
}
```

**Option C: Manual API Key (Optional)**
If you prefer to set the API key manually instead of using OAuth:
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