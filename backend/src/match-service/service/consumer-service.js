import { getChannel } from '../clients/rabbitmq/connection.js';
import { isMatch } from '../utils/matchUtils.js';
import { notifyMatchFound, notifyMatchTimeout } from './notification-service.js';
import { RABBITMQ_CONFIG } from '../clients/rabbitmq/config.js';
import { redisPromise } from '../clients/redis/config.js';
export const initConsumers = () => {
    const channel = getChannel();
    if (!channel) throw new Error('Channel not initialized');

    channel.consume(RABBITMQ_CONFIG.QUEUES.EXACT,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.EXACT),
        { noAck: true }
    );

    channel.consume(RABBITMQ_CONFIG.QUEUES.TOPIC,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.TOPIC),
        { noAck: true  }
    );

    channel.consume(RABBITMQ_CONFIG.QUEUES.DIFFICULTY,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.DIFFICULTY),
        { noAck: true }
    );

    console.log('All consumers initialized');
};

const processQueueMessage = async (msg, queueType) => {
    const channel = getChannel();
    if (!msg) return;

    try {
        const { command } = await redisPromise;
        const content = JSON.parse(msg.content.toString());
        const { userId, topic, difficulty } = content;

        const userKey = `match:${queueType}:${userId}`;
        const userSetKey = `match:${queueType}:users`;

        // Add user to tracking set and store data
        await command.multi()
            .sAdd(userSetKey, userId)
            .setEx(userKey, RABBITMQ_CONFIG.TTL/1000, JSON.stringify(content))
            .exec();

        // Wait for new data for matching using event driven method by watching the redis matches for new records
        while (true) {
            try {
                await command.WATCH(userKey, userSetKey);

                const candidates = await command.sMembers(userSetKey);
                const otherUsers = candidates.filter(id => id !== userId);

                if (otherUsers.length === 0) {
                    await command.UNWATCH();
                    break;
                }

                const [candidateId] = otherUsers;
                const candidateKey = `match:${queueType}:${candidateId}`;

                // Check for null candidateData
                const candidateDataRaw = await command.get(candidateKey);
                if (!candidateDataRaw) {
                    await command.UNWATCH();
                    continue;
                }
                const candidateData = JSON.parse(candidateDataRaw);

                if (content && candidateData && isMatch(content, candidateData, queueType)) {
                    await command.multi()
                        .sRem(userSetKey, userId)
                        .sRem(userSetKey, candidateId)
                        .del(userKey, candidateKey)
                        .exec();

                    await notifyMatchFound(userId, candidateId, topic, difficulty);
                    return;
                }

                await command.UNWATCH();
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error("Error in watch: ", error)
            }
        }
    } catch (error) {
        console.error(`Error processing message:`, error);
    }
};


const processExpiredMatch = async (userId) => {
    if (!userId) return;
    try {
        console.log(`Processing expired match for user ${userId}`);
        notifyMatchTimeout(userId);
    } catch (error) {
        console.error('Error processing expired match:', error);
    }
};

export { processExpiredMatch };