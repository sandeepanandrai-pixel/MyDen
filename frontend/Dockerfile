# Stage 1: Build the React app
FROM node:18-bullseye as builder

# Set working directory
WORKDIR /app

# Set npm configs
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --verbose

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy build files
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
