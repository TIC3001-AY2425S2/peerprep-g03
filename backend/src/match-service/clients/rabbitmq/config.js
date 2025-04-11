export const RABBITMQ_CONFIG = {
    URL: process.env.RABBITMQ_URL || 'amqp://root:example@localhost:5672',
    QUEUES: {
        EXACT: 'exact_matches',
        TOPIC: 'topic_matches',
        DIFFICULTY: 'difficulty_matches',
        EXPIRED: 'expired_matches'
    },
    EXCHANGES: {
        PRIORITY: 'match_priority',
        DEAD_LETTER: 'dlx',
        DELAYED_MESSAGE: 'x-delayed-message',
        DELAYED_TYPE: 'x-delayed-type'
    },
    ROUTING_KEYS: {
        EXACT: 'exact',
        TOPIC: 'topic',
        DIFFICULTY: 'difficulty',
        EXPIRED: 'expired'
    },
    PRIORITY: {
        HIGH: 3,
        MIDDLE: 2,
        LOW: 1
    },
    TTL: 30000,
    CLEANUP_INTERVAL: 5000,
    DIRECT_VALUE: 'direct',
    CONTENT_VALUE : 'application/json'
}