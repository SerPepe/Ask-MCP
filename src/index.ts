#!/usr/bin/env node

import { AskMCPServer } from './ask-mcp-server.js';

async function main() {
  const server = new AskMCPServer();
  await server.listen();
}

main().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});