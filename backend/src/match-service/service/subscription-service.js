import { redisPromise } from '../clients/redis/config.js';
import {processExpiredMatch} from "./consumer-service.js";

(async () => {
    try {
        const { subscriber } = await redisPromise;
        await subscriber.subscribe('__keyevent@0__:expired',
            async (message, channel) => {
                try {
                    console.log(`Key details: ${message}`)
                    const parts = message.split(':');
                    if (parts[0] === 'match' && parts.length === 3) {
                        const [, queueType, userId] = parts;
                        await processExpiredMatch(userId);
                    }
                } catch (error) {
                    console.error('Error processing expiration:', error);
                }
            }
        );

        console.log('Subscribed to key expirations');

    } catch (error) {
        console.error('Expiration subscriber failed:', error);
    }
})();