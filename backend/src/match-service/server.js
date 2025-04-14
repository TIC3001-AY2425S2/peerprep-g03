import http from 'http';
import { app, wss } from './app.js';
import {initializeMatchService} from './controller/match-controller.js';
import { WS_PATH } from './constants/websocket.js';
import './service/subscription-service.js';



const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});


server.listen(PORT, async () => {
    console.log(`HTTP server running on http://0.0.0.0:${PORT}`);
    console.log(`WebSocket endpoint available at ws://0.0.0.0:${PORT}/${WS_PATH}`);

    await initializeMatchService();
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await MatchService.close();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

