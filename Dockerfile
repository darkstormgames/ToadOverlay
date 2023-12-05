# syntax=docker/dockerfile:1

FROM node:18.18.2-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
## Install dependencies
RUN npm install --production
#RUN npm ci --only=production

COPY . .

RUN mkdir -p /usr/src/app/app_data

CMD ["node", "index.js"]
