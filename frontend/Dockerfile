FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Set environment variables for UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Install build deps for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with UTF-8 support
RUN npm run build

# Production stage
FROM node:20-alpine

# Set environment variables for UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/.output ./
# Copy content for blog API fallback (reads frontmatter from files)
COPY --from=builder /app/content ./content

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# Change ownership of the app directory
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server/index.mjs"]
