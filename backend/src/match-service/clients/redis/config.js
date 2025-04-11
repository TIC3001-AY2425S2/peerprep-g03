import { createClient } from 'redis';

const URL = process.env.REDIS_URL || 'redis://example@localhost:6379';

let redisInstance = null;

export const initializeRedis = async () => {
    if (!redisInstance) {
        try {
            const commandClient = createClient({ url: URL });
            await commandClient.connect();
            await commandClient.CONFIG_SET('notify-keyspace-events', 'Ex');

            const subscriberClient = commandClient.duplicate();
            await subscriberClient.connect();

            redisInstance = {
                command: commandClient,
                subscriber: subscriberClient
            };

            console.log('Redis clients initialized');
            return redisInstance;
        } catch (error) {
            console.error('Redis initialization failed:', error);
            process.exit(1);
        }
    }
    return redisInstance;
};

export const redisPromise = initializeRedis();