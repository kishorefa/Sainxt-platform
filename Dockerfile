# Stage 1: Build the application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Using --legacy-peer-deps to handle React 19 and next-auth compatibility
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=mongodb://dummy:password@dummy:27017/db
ENV NEXTAUTH_SECRET=dummy-secret
ENV NEXTAUTH_URL=http://localhost:3000
ENV NODE_ENV=production

# Create a dummy .env.local for build
RUN echo "MONGODB_URI=$MONGODB_URI" > .env.local && \
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local && \
    echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env.local && \
    echo "NODE_ENV=$NODE_ENV" >> .env.local

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/next.config.mjs .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Environment variables that should be set at runtime
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose the port the app runs on
EXPOSE 3000

# Set the user to non-root
USER nextjs

# Start the application
CMD ["npm", "start"]
