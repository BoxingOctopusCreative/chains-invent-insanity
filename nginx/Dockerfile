FROM nginx:1.29.8-alpine

RUN rm /etc/nginx/nginx.conf
COPY config/nginx.conf /etc/nginx/

RUN rm /etc/nginx/conf.d/default.conf
COPY config/default.conf /etc/nginx/conf.d/
