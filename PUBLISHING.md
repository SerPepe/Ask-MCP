# Publishing Guide 🚀

This guide will help you publish the Ask-MCP package to GitHub and npm.

## Prerequisites

- GitHub account
- npm account (create at [npmjs.com](https://npmjs.com))
- Git configured locally
- npm CLI logged in (`npm login`)

## 📦 Publishing to npm

### 1. Login to npm
```bash
npm login
```

### 2. Update package.json
Before publishing, update these fields in `package.json`:
- `author`: Your name and email
- `repository.url`: Your GitHub repository URL
- `bugs.url`: Your GitHub issues URL
- `homepage`: Your GitHub repository URL

### 3. Build and test
```bash
npm run build
node test-mcp-client.js  # Verify functionality
```

### 4. Publish to npm
```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish
```

### 5. Verify publication
```bash
# Check if package is available
npm view ask-mcp

# Test global installation
npm install -g ask-mcp
ask-mcp --help
```

## 🐙 Publishing to GitHub

### 1. Create GitHub repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it `ask-mcp`
4. Make it public
5. Don't initialize with README (we already have one)

### 2. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/yourusername/ask-mcp.git

# Add all files
git add .

# Commit
git commit -m "Initial release: Ask-MCP v1.0.0

✨ Features:
- 5 AI models (Grok, Gemini, Kimi, Qwen, GLM)
- OpenRouter OAuth integration
- MCP protocol compatibility
- Free tier support
- TypeScript implementation"

# Push to GitHub
git push -u origin main
```

### 3. Create GitHub release
1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Ask-MCP v1.0.0 - Initial Release`
5. Description:
   ```markdown
   🎉 **Initial Release of Ask-MCP!**
   
   A powerful MCP server providing access to multiple AI models through OpenRouter.
   
   ## ✨ Features
   - 🎯 5 Premium AI Models: Grok, Gemini 2.5 Pro, Kimi, Qwen3 Coder, GLM-4.5
   - 💰 Free Tier Support
   - 🔐 OAuth Authentication
   - 🔌 MCP Compatible (Cursor, Claude Desktop)
   - 📦 TypeScript Implementation
   
   ## 🚀 Installation
   ```bash
   npm install -g ask-mcp
   ```
   
   ## 📖 Documentation
   See [README.md](README.md) for full setup and usage instructions.
   ```
6. Click "Publish release"

## 🔄 Future Updates

### Version Updates
```bash
# Update version
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Build and publish
npm run build
npm publish

# Push to GitHub
git push --follow-tags
```

### GitHub Actions (Optional)
Consider setting up GitHub Actions for automated testing and publishing:

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📋 Checklist

- [ ] Updated package.json metadata
- [ ] Created LICENSE file
- [ ] Updated README.md
- [ ] Built and tested locally
- [ ] Published to npm
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Created GitHub release
- [ ] Tested global installation

## 🎉 Success!

Your Ask-MCP package is now available for the community to use!

- **npm**: `npm install -g ask-mcp`
- **GitHub**: `https://github.com/yourusername/ask-mcp`

Share it with the MCP community! 🚀