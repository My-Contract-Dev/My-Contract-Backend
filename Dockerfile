FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . /app

CMD npm run start