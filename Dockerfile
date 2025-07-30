FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Expose port (MCP servers typically use stdio, but we'll expose 8080 for potential HTTP usage)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]