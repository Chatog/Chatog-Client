FROM nginx

ADD ./dist /usr/app
ADD ./cert /usr/cert
ADD ./docker/nginx.conf /etc/nginx/nginx.conf