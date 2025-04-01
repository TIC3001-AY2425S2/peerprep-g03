import amqp from 'amqplib';
import { RABBITMQ_CONFIG } from './config.js';

let connection = null
let channel = null

export const getConnection = ()=> connection;
export const getChannel = () => channel;

export const connect =  async () => {
    try {
        connection =  await amqp.connect(RABBITMQ_CONFIG.URL);
        console.log('Connected to RabbitMQ Server', RABBITMQ_CONFIG.URL);
        channel = await connection.createConfirmChannel();
        return {connection, channel}
    } catch {
        console.error('Failed to connect to RabbitMQ Server: ', error);
        throw error;
    }
};

export const close =  async () => {
    if (channel) await channel.close();
    if(connection) await connection.close();
    channel = null;
    connection = null;
}