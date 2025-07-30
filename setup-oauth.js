#!/usr/bin/env node

/**
 * Interactive OAuth Setup for Ask MCP Tool
 * This script guides users through OpenRouter OAuth authentication
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';
import http from 'http';
import { createHash, randomBytes } from 'crypto';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const CONFIG_FILE = path.join(__dirname, '.env.local');
const PORT = 8080;
const REDIRECT_URI = `http://localhost:${PORT}`;

console.log('🚀 Welcome to Ask MCP OAuth Setup!');
console.log('This will help you authenticate with OpenRouter using OAuth flow.\n');

const generateCodeVerifier = () => {
  return randomBytes(32).toString('base64url');
};

const generateCodeChallenge = (verifier) => {
  return createHash('sha256').update(verifier).digest('base64url');
};

const saveConfig = (apiKey) => {
  const config = `# Ask MCP Tool Configuration\nOPENROUTER_API_KEY=${apiKey}\n`;
  fs.writeFileSync(CONFIG_FILE, config);
  console.log(`✅ Configuration saved to ${CONFIG_FILE}`);
};

const main = async () => {
  let server;
  try {
    await question('Press ENTER to start OAuth authentication with OpenRouter...');

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    server = http.createServer(async (req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');

      if (code) {
        res.end('<h1>Authentication successful!</h1><p>You can close this window.</p>');
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

          console.log('🔑 API Key received!');
          saveConfig(key);

          console.log('\n🎉 OAuth setup complete!');
          console.log('Your API key is saved in .env.local');
          console.log('The Ask MCP tool will now use this key.');
          process.exit(0);
        } catch (e) {
            console.error('❌ Setup failed during code exchange:', e.message);
            process.exit(1);
        }

      } else {
        res.end('<h1>Waiting for authentication...</h1>');
      }
    }).listen(PORT, async () => {
      const authUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

      console.log('\n🔐 Opening your browser for OpenRouter authentication...');
      console.log('If your browser does not open, please copy and paste this URL:');
      console.log(authUrl);
      await open(authUrl);
    });

    console.log(`\n👂 Waiting for authentication callback on port ${PORT}...`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (server) server.close();
    process.exit(1);
  } 
};

process.on('SIGINT', () => {
  console.log('\n👋 Setup cancelled.');
  process.exit(0);
});

main();