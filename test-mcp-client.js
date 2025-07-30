#!/usr/bin/env node

// Simple MCP client to test the ask-mcp server
import { spawn } from 'child_process';
import readline from 'readline';

// Test the MCP server by sending a list-tools request and then a tool call
async function testMCPServer() {
  console.log('🧪 Testing Ask-MCP Server...');
  
  // Start the MCP server process
  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let responseBuffer = '';
  let requestId = 1;

  // Handle server responses
  serverProcess.stdout.on('data', (data) => {
    responseBuffer += data.toString();
    
    // Try to parse complete JSON responses
    const lines = responseBuffer.split('\n');
    responseBuffer = lines.pop() || ''; // Keep incomplete line
    
    lines.forEach(line => {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          console.log('📥 Server Response:', JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('📥 Raw Response:', line);
        }
      }
    });
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('❌ Server Error:', data.toString());
  });

  // Wait a moment for server to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: List available tools
  console.log('\n🔍 Test 1: Listing available tools...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/list'
  };
  
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Call ask-grok tool
  console.log('\n🤖 Test 2: Testing ask-grok tool...');
  const askGrokRequest = {
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'ask-grok',
      arguments: {
        question: 'What is 2+2? Please give a very brief answer.',
        system_prompt: 'You are a helpful math assistant. Be concise.',
        free: false
      }
    }
  };
  
  serverProcess.stdin.write(JSON.stringify(askGrokRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n✅ Test completed! Check the responses above.');
  
  // Clean up
  serverProcess.kill();
  process.exit(0);
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});

// Run the test
testMCPServer().catch(console.error);