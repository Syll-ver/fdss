# build stage
FROM node:10-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk update
RUN apk add --no-cache git


# proxy
#ENV http_proxy "http://172.16.1.6:3128"
#ENV https_proxy "http://172.16.1.6:3128"

# under a proxy
#RUN npm config set registry http://registry.npmjs.org/
#RUN npm config set http-proxy http://172.16.1.6:3128
#RUN npm config set https-proxy http://172.16.1.6:3128
#RUN npm config set proxy http://172.16.1.6:3128


RUN npm install
COPY . .
RUN npm run build
# production stage
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]