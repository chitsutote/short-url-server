import Redis from 'ioredis';
import config from '../config';

const cacheDataSource = new Redis({
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
});

export default cacheDataSource;
