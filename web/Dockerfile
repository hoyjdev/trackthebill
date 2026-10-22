# Stage 1: Build
FROM node:22-alpine AS builder

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies using lockfile
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy app source and build SSR / client bundles
COPY . .
RUN pnpm build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary production artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server/node.js"]
