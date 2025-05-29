FROM node:lts-alpine AS build
LABEL authors="Dmitry"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

#Nginx
FROM nginx:latest AS prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
#CMD ["nginx", "-g", "daemon off;"]

#ENTRYPOINT ["top", "-b"]

