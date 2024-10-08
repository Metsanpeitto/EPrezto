# Dockerfile for Node.js Express App
FROM node:18

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm install

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy the rest of the backend files
COPY . .

EXPOSE 8080
CMD ["node", "server.js"] # Adjust to your entry point file

