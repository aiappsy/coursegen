FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5 && \
    npm install --no-audit --no-fund

# Copy the rest of your code
COPY . .

# Build the frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]