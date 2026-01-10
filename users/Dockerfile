FROM node:22-alpine

WORKDIR /app

# Copy package files from the users folder
COPY users/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code from the users folder
COPY users/ ./

EXPOSE 5000

CMD ["node", "server.js"]
