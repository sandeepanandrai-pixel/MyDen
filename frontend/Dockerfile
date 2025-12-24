# Stage 1: Build
FROM node:18-bullseye as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps && \
    chmod -R 777 node_modules

# Copy source code
COPY . .

# Build using full path to react-scripts
RUN ./node_modules/.bin/react-scripts build || \
    $(npm bin)/react-scripts build || \
    npx --yes react-scripts build

# Stage 2: Production
FROM nginx:stable-alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
