FROM node:16.16.0

WORKDIR /app
COPY package.json .
RUN yarn
COPY . .

CMD yarn start:dev