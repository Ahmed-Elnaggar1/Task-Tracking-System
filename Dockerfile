# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy server files
COPY server/package*.json ./
COPY server/ ./

# Install server dependencies
RUN npm install --omit=dev

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
