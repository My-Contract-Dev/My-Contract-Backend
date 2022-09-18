FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

ADD . /app

CMD npm run generate
CMD npm run build

CMD npm run start