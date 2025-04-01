import clientStore from '../store/clientStore.js';
import {WebSocketStatus} from "../constants/websocket.js";
import {getRandomQuestion} from "./client-service.js";
import {randomUUID} from 'crypto'

export const notifyMatchFound = async (userId1, userId2, topic, difficulty) => {
    console.log(`Notifying users ${userId1} and ${userId2} of match details`);
    const questionId = await getRandomQuestion(topic, difficulty);
    [userId1, userId2].forEach(userId => {
        const ws = clientStore.get(userId);
        if (ws && ws.readyState == WebSocketStatus.OPEN) {
            try {
                ws.send(JSON.stringify({
                    type: 'MATCH_FOUND',
                    match: {
                        userId: userId === userId1 ? userId2 : userId1,
                        topic,
                        difficulty,
                        sessionId : randomUUID(),
                        questionId : questionId
                    }

                }), (error) => {
                    if (error) {
                        console.error('Failed to send match found message to user', userId, error);
                    } else {
                        console.log('Match found message sent to user', userId);
                        clientStore.delete(userId);
                    }
                });
            } catch (error) {
                console.error('Exception to send match found message to user', userId, error);
            }
        } else {
            console.warn(`Cannot send to user ${userId} as connection is not open`);
            clientStore.delete(userId);
        }
    });
};

export const notifyMatchTimeout = (userId) => {
    const ws = clientStore.get(userId);

    if (ws && ws.readyState === WebSocketStatus.OPEN) {
        try {
            ws.send(JSON.stringify({
                type: 'MATCH_TIMEOUT',
                message: 'No match found after 30 seconds'
            }), (error) => {
                if (error) {
                    console.error(`Error sending timeout notification to ${userId}:`, error);
                } else {
                    console.log(`Successfully sent timeout notification to ${userId}`);
                    clientStore.delete(userId);
                }
            });
        } catch (error) {
            console.error(`Exception sending timeout notification to ${userId}:`, error);
        }
    } else {
        console.warn(`Cannot send timeout to user ${userId}, WebSocket not open`);
        clientStore.delete(userId);
    }
};
