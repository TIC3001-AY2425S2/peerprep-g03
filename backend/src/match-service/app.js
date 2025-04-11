import express from 'express';
import { WebSocketServer } from 'ws';
import {handleConnection} from './controller/match-controller.js';
import { WS_PATH } from './constants/websocket.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Matchmaking server is running');
});

const wss = new WebSocketServer({
    noServer: true,
    path: WS_PATH
});

wss.on('connection', (ws) => handleConnection(ws));

export { app, wss };
