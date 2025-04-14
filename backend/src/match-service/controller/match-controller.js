import clientStore from '../store/clientStore.js';
import matchService from '../service/match-service.js';
import { MessageTypes } from '../constants/websocket.js';
import { handleStartMatch, handleCancelMatch, handlePing, sendResponse, parseMessage } from './match-handler.js';

const messageHandlers = {
    [MessageTypes.START_MATCH]: handleStartMatch,
    [MessageTypes.CANCEL_MATCH]: handleCancelMatch,
    [MessageTypes.PING]: handlePing
};

const handleMessage = async (ws, message) => {
    try {
        const parsed = parseMessage(message);

        if (!parsed.type || !parsed.userId) {
            return sendResponse(ws, MessageTypes.ERROR, 'Missing required fields');
        }

        const handler = messageHandlers[parsed.type];
        if (!handler) {
            throw new Error(`Unknown message type: ${parsed.type}`);
        }

        return await handler(ws, parsed);
    } catch (error) {
        return sendResponse(ws, MessageTypes.MATCH_ERROR, error.message);
    }
};

const handleConnection = (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => handleMessage(ws, message));

    ws.on('close', () => {
        if (ws.userId) {
            clientStore.delete(ws.userId);
            console.log(`Connection closed for user ${ws.userId}`);
        }
    });

    sendResponse(ws, MessageTypes.CONNECTION_ESTABLISHED, null, { timestamp: Date.now() });
};

const initializeMatchService = async () => {
    const connection = await matchService.connectRabbitMQ();
    matchService.initConsumers();
    return connection;
};

export {
    handleConnection,
    handleMessage,
    initializeMatchService
};
