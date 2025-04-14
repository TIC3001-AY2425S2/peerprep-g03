FROM node:22.14

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 1234

CMD ["npx", "y-websocket" ]
