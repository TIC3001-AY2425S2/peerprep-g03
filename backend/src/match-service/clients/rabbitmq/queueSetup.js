import {getChannel} from './connection.js';
import {RABBITMQ_CONFIG} from './config.js';


export const setupQueueAndExchange = async () => {
    const channel = getChannel()
    if(!channel) throw new Error('Channel not available');

    try {
        await channel.assertExchange(RABBITMQ_CONFIG.EXCHANGES.PRIORITY, RABBITMQ_CONFIG.EXCHANGES.DELAYED_MESSAGE, {
            durable: true,
            arguments: { 'x-delayed-type': RABBITMQ_CONFIG.DIRECT_VALUE}
        });
        console.log('Using delayed message exchange');
    } catch (error) {
        console.error('Failed to assert delayed exchange: ', error);
        throw error;
    }

    await Promise.all([
        channel.assertQueue(RABBITMQ_CONFIG.QUEUES.EXACT, {
            durable: true,
            arguments: {
                'x-message-ttl': RABBITMQ_CONFIG.TTL,
                'x-max-priority': RABBITMQ_CONFIG.PRIORITY.HIGH
            }
        }),
        channel.assertQueue(RABBITMQ_CONFIG.QUEUES.TOPIC, {
            durable: true,
            arguments: {
                'x-message-ttl': RABBITMQ_CONFIG.TTL,
                'x-max-priority': RABBITMQ_CONFIG.PRIORITY.MIDDLE
            }
        }),
        channel.assertQueue(RABBITMQ_CONFIG.QUEUES.DIFFICULTY, {
            durable: true,
            arguments: {
                'x-message-ttl': RABBITMQ_CONFIG.TTL,
                'x-dead-letter-exchange': RABBITMQ_CONFIG.EXCHANGES.DEAD_LETTER,
                'x-dead-letter-routing-key': RABBITMQ_CONFIG.ROUTING_KEYS.EXPIRED,
                'x-max-priority': RABBITMQ_CONFIG.PRIORITY.LOW
            }
        })
    ]);

    await channel.assertExchange(RABBITMQ_CONFIG.EXCHANGES.DEAD_LETTER, RABBITMQ_CONFIG.DIRECT_VALUE, { durable: true });
    await channel.assertQueue(RABBITMQ_CONFIG.QUEUES.EXPIRED, { durable: true });
    await channel.bindQueue(
        RABBITMQ_CONFIG.QUEUES.EXPIRED,
        RABBITMQ_CONFIG.EXCHANGES.DEAD_LETTER,
        RABBITMQ_CONFIG.ROUTING_KEYS.EXPIRED
    );

    await Promise.all([
        channel.bindQueue(
            RABBITMQ_CONFIG.QUEUES.EXACT,
            RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
            RABBITMQ_CONFIG.ROUTING_KEYS.EXACT
        ),
        channel.bindQueue(
            RABBITMQ_CONFIG.QUEUES.TOPIC,
            RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
            RABBITMQ_CONFIG.ROUTING_KEYS.TOPIC
        ),
        channel.bindQueue(
            RABBITMQ_CONFIG.QUEUES.DIFFICULTY,
            RABBITMQ_CONFIG.EXCHANGES.PRIORITY,
            RABBITMQ_CONFIG.ROUTING_KEYS.DIFFICULTY
        )
    ]);
    console.log('All exchanges and queues configured successfully');
}