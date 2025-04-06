FROM node:20

WORKDIR /app

COPY ../.. .
RUN npm install
RUN npm install socket.io

EXPOSE 4002

CMD ["npm", "start"]