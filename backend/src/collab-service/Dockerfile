FROM node:20

WORKDIR /app

COPY ../.. .
RUN npm install
RUN npm install socket.io

EXPOSE 4000

CMD ["npm", "start"]