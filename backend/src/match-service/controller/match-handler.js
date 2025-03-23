import clientStore from '../store/clientStore.js';
import matchService from '../service/match-service.js';
import { WebSocketStatus } from '../constants/websocket.js';

export const handleStartMatch = async (ws, data) => {
    if (!data.data?.topic || !data.data?.difficulty) {
        throw new Error('Missing topic/difficulty');
    }

    clientStore.set(data.userId, ws);
    ws.userId = data.userId;

    return matchService.addToQueue(data.userId, data.data);
};

export const handleCancelMatch = (ws, data) => {
    clientStore.delete(data.userId);
    return sendResponse(ws, 'MATCH_CANCELLED');
};

export const handlePing = (ws) => {
    return sendResponse(ws, 'PONG');
};

export const sendResponse = (ws, type, message = null, additionalData = {}) => {
    if (ws.readyState === WebSocketStatus.OPEN) {
        const response = {
            type,
            ...additionalData
        };

        if (message) {
            response.message = message;
        }

        ws.send(JSON.stringify(response));
        return true;
    }
    return false;
};

export const parseMessage = (message) => {
    try {
        return JSON.parse(message);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};