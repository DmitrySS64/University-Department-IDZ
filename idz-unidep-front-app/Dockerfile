# frontend/Dockerfile.frontend
FROM node:lts-alpine AS frontend_artifacts
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# финальный образ без NGINX
#FROM alpine:latest AS artifacts
#WORKDIR /dist
#COPY --from=build /app/dist .

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend_artifacts /dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]