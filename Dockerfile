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

<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> cdf16f7ca7cdf3ecda4ee5e82f236edb78e87c5a
>>>>>>> f67db03e972699acb14237ea45a8669c4cf37dbd
RUN npm install
COPY . .
RUN npm run build
# production stage
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
<<<<<<< HEAD
CMD ["nginx", "-g", "daemon off;"]
=======
<<<<<<< HEAD
CMD ["nginx", "-g", "daemon off;"]
=======
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> cdf16f7ca7cdf3ecda4ee5e82f236edb78e87c5a
>>>>>>> f67db03e972699acb14237ea45a8669c4cf37dbd
