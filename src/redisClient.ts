// src/redisClient.ts

import redis from 'redis';

// Creating a Redis client
const client = redis.createClient({
  host: 'localhost', // Redis server hostname or IP address
  port: 6379,        // Redis server port
  // You can add authentication here if needed (password, etc.)
});

// Connect to Redis
client.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle Redis errors
client.on('error', (err) => {
  console.error('Redis error: ', err);
});

export default client;
