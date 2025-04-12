import { createClient } from 'redis';

const URL = process.env.REDIS_URL || 'redis://example@localhost:6379';  

const redisClient = createClient({
    url: URL,
  });

  redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
  });

  redisClient.connect()
  .then(() => {
    console.log(`Connected to Redis at ${URL}`);
  })
  .catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });

export default redisClient;