#!/usr/bin/env node

// Simple test script to verify the MCP server is working
// This simulates basic MCP protocol communication

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'dist', 'index.js');

// Set test environment
process.env.OPENROUTER_API_KEY = 'test-key';

console.log('Testing Ask MCP Server...');
console.log('Server path:', serverPath);

// Test if server starts without crashing
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, OPENROUTER_API_KEY: 'test-key' }
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  if (errorOutput.includes('Ask MCP server running on stdio')) {
    console.log('✅ Server started successfully!');
  } else {
    console.log('❌ Server failed to start properly');
    console.log('Error output:', errorOutput);
  }
});

// Send a simple initialization message
setTimeout(() => {
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  server.stdin.write(JSON.stringify(initMessage) + '\n');
  
  // Close after a short delay
  setTimeout(() => {
    server.kill();
  }, 1000);
}, 100);