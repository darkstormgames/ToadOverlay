# syntax=docker/dockerfile:1

FROM node:18.18.2-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
## Install dependencies
RUN npm install
#RUN npm ci --only=production

COPY . .

CMD ["node", "index.js"]
