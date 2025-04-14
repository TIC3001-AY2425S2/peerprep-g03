import { getChannel, connect } from '../clients/rabbitmq/connection.js';
import { RABBITMQ_CONFIG } from '../clients/rabbitmq/config.js';
import { createMessage } from '../utils/matchUtils.js';

export const publishMatchRequest = async (userId, criteria) => {
    let channel = getChannel();

    if (!channel) {
        console.log('Connecting to RabbitMQ...');
        await connect();
        channel = getChannel();
        if (!channel) {
            throw new Error('Failed to initialize RabbitMQ channel');
        }
    }

    const message = createMessage(userId, criteria);

    try {
        console.log(`Publishing match request for user ${userId}`, criteria);
        const publishOptions = {
            persistent: true,
            contentType: RABBITMQ_CONFIG.CONTENT_VALUE,
            timestamp: Date.now()
        };

        await Promise.all([
            channel.publish(
                RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
                RABBITMQ_CONFIG.ROUTING_KEYS.EXACT,
                Buffer.from(JSON.stringify(message)),
                {
                    ...publishOptions,
                    headers: { 'x-delay': 0 },
                    priority: RABBITMQ_CONFIG.PRIORITY.HIGH
                }
            ),
            channel.publish(
                RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
                RABBITMQ_CONFIG.ROUTING_KEYS.TOPIC,
                Buffer.from(JSON.stringify(message)),
                {
                    ...publishOptions,
                    headers: { 'x-delay': 5000 },
                    priority: RABBITMQ_CONFIG.PRIORITY.MIDDLE
                }
            ),
            channel.publish(
                RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
                RABBITMQ_CONFIG.ROUTING_KEYS.DIFFICULTY,
                Buffer.from(JSON.stringify(message)),
                {
                    ...publishOptions,
                    headers: { 'x-delay': 10000 },
                    priority: RABBITMQ_CONFIG.PRIORITY.LOW
                }
            )
        ]);

        await channel.waitForConfirms();

        console.log(`Successfully published match request for user ${userId}`);
        return true;
    } catch (error) {
        console.error(`Failed to publish match request for user ${userId}:`, error);
        return false;
    }
};
