FROM node:20.18.0-alpine3.19

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3551 80

ENTRYPOINT [ "npm", "start" ]