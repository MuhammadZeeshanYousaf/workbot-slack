import { createClient } from 'redis';

let redisClient;

export const getCacheClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!)
      }
    });
    redisClient.on('error', error => console.error(`Error : ${error}`));
    await redisClient.connect();
  }

  return redisClient;
};

export const cacheClient = (async () =>
  getCacheClient()
    .then(result => {
      console.log(`⚡️ Redis is running on port:${process.env.REDIS_PORT}`);

      return (redisClient = result);
    })
    .catch(error => {
      console.error(`Error : ${error}`);
    }))();
