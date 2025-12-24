# Build stage
FROM node:16 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with no optional packages and fix permissions
RUN npm install --legacy-peer-deps --no-optional && \
    npm cache clean --force

# Copy source files
COPY . .

# Set NODE_OPTIONS for build
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration if exists, otherwise use default
COPY nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || echo "Using default nginx config"

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
