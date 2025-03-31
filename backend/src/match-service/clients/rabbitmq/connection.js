import amqp from 'amqplib';
import { RABBITMQ_CONFIG } from './config.js';

let connection = null
let channel = null

export const getConnection = ()=> connection;
export const getChannel = () => channel;

export const connect = async (retries = 5, retryDelay = 5000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log('Coonnecting to RabbitMQ Server. Attempt: ', attempt);
            connection = await amqp.connect(RABBITMQ_CONFIG.URL);
            console.log('Connected to RabbitMQ Server', RABBITMQ_CONFIG.URL);
            channel = await connection.createConfirmChannel();
            return {connection, channel}
        }
        catch (error) {
            console.error('Failed to connect to RabbitMQ Server: ', error);
            if(attempt < retries){
                console.log('Retrying in 5 seconds');
                await sleep(retryDelay);
            }
        }
    }
    console.error('Failed to connect to RabbitMQ Server after ', retries, ' attempts');
    throw new Error('Failed to connect to RabbitMQ Server');
}

export const close =  async () => {
    if (channel) await channel.close();
    if(connection) await connection.close();
    channel = null;
    connection = null;
}