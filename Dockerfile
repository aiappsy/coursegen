FROM node:20-slim AS build

WORKDIR /app

# Install curl for Coolify health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm config set fetch-retry-maxtimeout 1000000 && \
    npm config set fetch-retries 10 && \
    npm config set maxsockets 5 && \
    npm install --no-audit --no-fund --loglevel info

# Copy the rest of your code
COPY . .

# Build the frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
