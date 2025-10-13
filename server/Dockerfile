FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

COPY .env .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["node", "dist/index.js"]
