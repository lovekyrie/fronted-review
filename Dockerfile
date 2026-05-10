# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

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

