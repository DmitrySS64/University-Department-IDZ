# nginx/Dockerfile.nginx
FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend_artifacts /dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
