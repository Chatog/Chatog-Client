FROM nginx

ADD ./dist /usr/app
ADD ./docker/nginx.conf /etc/nginx/nginx.conf