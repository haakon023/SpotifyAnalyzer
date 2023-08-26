# build stage
FROM node:lts-alpine as build-step
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/spotify/

COPY --from=build-step /app/dist ./
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 