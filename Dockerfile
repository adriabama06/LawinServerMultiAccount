FROM node:20.18.0-alpine3.19

RUN apk add --no-cache curl

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3551 80

ENTRYPOINT [ "npm", "start" ]