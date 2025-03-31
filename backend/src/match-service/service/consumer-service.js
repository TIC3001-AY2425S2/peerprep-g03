import { getChannel } from '../clients/rabbitmq/connection.js';
import matchStore from '../store/matchStore.js';
import clientStore from '../store/clientStore.js';
import { isMatch } from '../utils/matchUtils.js';
import { notifyMatchFound, notifyMatchTimeout } from './notification-service.js';
import { RABBITMQ_CONFIG } from '../clients/rabbitmq/config.js';

export const initConsumers = () => {
    const channel = getChannel();
    if (!channel) throw new Error('Channel not initialized');

    channel.consume(RABBITMQ_CONFIG.QUEUES.EXACT,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.EXACT),
        { noAck: false }
    );

    channel.consume(RABBITMQ_CONFIG.QUEUES.TOPIC,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.TOPIC),
        { noAck: false }
    );

    channel.consume(RABBITMQ_CONFIG.QUEUES.DIFFICULTY,
        msg => processQueueMessage(msg, RABBITMQ_CONFIG.QUEUES.DIFFICULTY),
        { noAck: false }
    );

    channel.consume(RABBITMQ_CONFIG.QUEUES.EXPIRED, processExpiredMatch, { noAck: false });

    console.log('All consumers initialized');

    setInterval(() => matchStore.cleanupStaleMatches(), RABBITMQ_CONFIG.CLEANUP_INTERVAL);
};

const processQueueMessage = async (msg, queueType) => {
    if (!msg) return;
    const channel = getChannel();

    try {
        const content = JSON.parse(msg.content.toString());
        const { userId, topic, difficulty } = content;

        console.log(`Processing ${queueType} message for user ${userId}`);

        if (!clientStore || !clientStore.has(userId)) {
            console.log(`User ${userId} is no longer connected, acknowledging message`);
            channel.ack(msg);
            return;
        }

        let matchFound = false;
        const queueMatches = matchStore.getAllMatch(queueType);

        for (const [candidateId, candidateData] of queueMatches.entries()) {
            // Skip self-match
            if (candidateId === userId) continue;

            if (isMatch(content, candidateData, queueType)) {
                console.log(`Match found in ${queueType} between ${userId} and ${candidateId}`);
                matchStore.removeMatch(queueType, candidateId);
                notifyMatchFound(userId, candidateId, topic, difficulty);

                channel.ack(msg);
                channel.ack(candidateData.msg);

                matchFound = true;
                break;
            }
        }

        if (!matchFound) {
            console.log(`No immediate match for ${userId} in ${queueType}, adding to active matches`);
            matchStore.addMatch(queueType, userId, { userId, topic, difficulty, msg });
        }
    } catch (error) {
        console.error(`Error processing message in ${queueType}:`, error);
        channel.nack(msg, false, false);
    }
};

const processExpiredMatch = (msg) => {
    if (!msg) return;
    const channel = getChannel();

    try {
        const content = JSON.parse(msg.content.toString());
        const { userId } = content;

        console.log(`Processing expired match for user ${userId}`);
        matchStore.removeFromAll(userId);
        notifyMatchTimeout(userId);

        channel.ack(msg);
    } catch (error) {
        console.error('Error processing expired match:', error);
        channel.ack(msg);
    }
};