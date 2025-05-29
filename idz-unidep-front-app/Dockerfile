# frontend/Dockerfile.frontend
FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# финальный образ без NGINX
FROM alpine:latest AS artifacts
WORKDIR /dist
COPY --from=build /app/dist .