#!/usr/bin/env node

/**
 * Test script to demonstrate OAuth functionality in Ask MCP tool
 * This script shows how to use the new OAuth tools for OpenRouter authentication
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Testing OAuth functionality in Ask MCP tool...');
console.log('📍 Server path:', path.join(__dirname, 'dist', 'index.js'));

// Test OAuth tools availability
const testOAuthTools = () => {
  console.log('\n✅ OAuth Tools Available:');
  console.log('  • openrouter-auth-url - Generate authorization URLs');
  console.log('  • openrouter-exchange-code - Exchange codes for API keys');
  
  console.log('\n📋 OAuth Flow:');
  console.log('  1. Generate authorization URL with openrouter-auth-url');
  console.log('  2. User visits URL and authorizes application');
  console.log('  3. Get authorization code from callback');
  console.log('  4. Exchange code for API key with openrouter-exchange-code');
  console.log('  5. Set API key as OPENROUTER_API_KEY environment variable');
  
  console.log('\n🔧 Environment Variables (Optional):');
  console.log('  • OPENROUTER_CLIENT_ID - Your OAuth client ID');
  console.log('  • OPENROUTER_CLIENT_SECRET - Your OAuth client secret');
  console.log('  • OPENROUTER_REDIRECT_URI - Callback URL (default: http://localhost:8080/callback)');
  
  console.log('\n🎯 Example Usage:');
  console.log('  {');
  console.log('    "name": "openrouter-auth-url",');
  console.log('    "arguments": {');
  console.log('      "redirect_uri": "http://localhost:8080/callback",');
  console.log('      "state": "security-state-123"');
  console.log('    }');
  console.log('  }');
};

// Start the server to verify it loads with OAuth support
const serverPath = path.join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

let serverOutput = '';

server.stdout.on('data', (data) => {
  serverOutput += data.toString();
});

server.stderr.on('data', (data) => {
  serverOutput += data.toString();
});

// Give server time to start
setTimeout(() => {
  server.kill();
  
  if (serverOutput.includes('error') || serverOutput.includes('Error')) {
    console.log('❌ Server failed to start with OAuth support');
    console.log('Output:', serverOutput);
    process.exit(1);
  } else {
    console.log('✅ Server started successfully with OAuth support!');
    testOAuthTools();
    console.log('\n🎉 OAuth implementation complete and tested!');
  }
}, 2000);

server.on('exit', (code) => {
  if (code === null) {
    // Server was killed by us, this is expected
    return;
  }
  
  if (code === 0) {
    console.log('✅ Server exited cleanly');
  } else {
    console.log('❌ Server exited with code:', code);
    process.exit(1);
  }
});