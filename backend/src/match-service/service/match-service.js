import { connect, close } from '../clients/rabbitmq/connection.js';
import { setupQueueAndExchange } from '../clients/rabbitmq/queueSetup.js';
import { initConsumers } from './consumer-service.js';
import { publishMatchRequest } from './publish-service.js';

const connectRabbitMQ = async () => {
    try {
        await connect();
        await setupQueueAndExchange();
        return true;
    } catch (error) {
        console.error('Failed to setup RabbitMQ:', error);
        return false;
    }
};

const matchService = {
    connectRabbitMQ,
    initConsumers,
    addToQueue: publishMatchRequest,
    close
};

export default matchService;