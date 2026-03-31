FROM node:20-slim AS build

WORKDIR /app

# Install build essentials if needed (though usually not for this project)
# RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

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
