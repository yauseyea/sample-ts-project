FROM node:20-alpine as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as development

FROM base as production