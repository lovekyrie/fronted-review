# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 9 仍会执行依赖的 postinstall，esbuild 二进制能装上
RUN npm install -g pnpm@9.15.9

# Copy dependency manifests
COPY package.json ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN pnpm run docs:build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

