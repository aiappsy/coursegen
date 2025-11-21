FROM oven/bun:1.0

WORKDIR /app

# Copy package files and install deps
COPY package.json bun.lockb* ./
RUN bun install

# Copy rest of the app
COPY . .

# Build the frontend
RUN bun run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]