FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies only (no scripts)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Set HTTP transport for Smithery deployment
ENV MCP_TRANSPORT=http

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]