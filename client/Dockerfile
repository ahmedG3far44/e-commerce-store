# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:stable
WORKDIR /var/www/app
COPY --from=builder /app/build .
COPY ./.nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
