# ---- Dockerfile for Ventrixa ----
# Use multi-stage build for a lean production image

# ---------- Builder stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json needed for caching)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Next.js app (creates .next, public, etc.)
RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine AS runner

# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create app directory
WORKDIR /app

# Copy only the needed files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
