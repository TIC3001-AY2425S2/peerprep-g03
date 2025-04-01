import { RABBITMQ_CONFIG } from '../clients/rabbitmq/config.js';
import { getChannel } from '../clients/rabbitmq/connection.js';

const createMatchStore = () => {
    const activeMatches = {
        [RABBITMQ_CONFIG.QUEUES.EXACT]: new Map(),
        [RABBITMQ_CONFIG.QUEUES.TOPIC]: new Map(),
        [RABBITMQ_CONFIG.QUEUES.DIFFICULTY]: new Map()
    }

    return {
        addMatch: (queueType, userId, data) => activeMatches[queueType].set(userId, data),
        getMatch: (queueType, userId) => activeMatches[queueType].get(userId),
        hasMatch: (queueType, userId) => activeMatches[queueType].has(userId),
        getAllMatch: (queueType) => activeMatches[queueType],
        removeMatch: (queueType, userId) => activeMatches[queueType].delete(userId),
        removeFromAll: (userId) => {
            Object.keys(activeMatches).forEach(queueType =>
                activeMatches[queueType].delete(userId)
            );
        },
        cleanupStaleMatches: () => {
            const now = Date.now();
            const channel = getChannel();

            Object.keys(activeMatches).forEach(queueType => {
                for( const [userId, data] of activeMatches[queueType].entries()) {
                    if(data.msg?.properties?.timestamp) {
                        const messageAge = now - data.msg.properties.timestamp;
                        if( messageAge > RABBITMQ_CONFIG.TTL) {
                            activeMatches[queueType].delete(userId);
                            channel.nack(data.msg, false, false)
                            console.log(`Removed stale match for user ${userId} in queue ${queueType}`);
                        }
                    }
                }
            })
        }

    }
}

const matchStore = createMatchStore();
export default matchStore;