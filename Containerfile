# ==========================================
# Stage 1: Dependency Installation & Compilation
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /src

# Copy dependency specifications
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Compile production bundle (.output)
RUN npm run build

# ==========================================
# Stage 2: Production Execution Environment
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set default production variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy only the compiled output from the builder stage
COPY --from=builder /src/.output ./.output

EXPOSE 3000

# Execute server bundle
CMD ["node", ".output/server/index.mjs"]
