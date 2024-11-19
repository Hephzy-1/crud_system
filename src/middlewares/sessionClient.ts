// src/middlewares/cacheMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import redisClient from '../redisClient';

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = `cache:${req.originalUrl}`; // Use the request URL as the cache key

  // Check if the cache contains the key
  redisClient.get(key, (err, result) => {
    if (err) {
      return next(err);
    }

    if (result) {
      // If cache exists, send the cached response
      return res.status(200).json(JSON.parse(result));
    } else {
      // Otherwise, proceed to the next middleware (controller) to fetch data
      res.sendResponse = res.json; // Backup the original `res.json` method
      res.json = (body: any) => {
        // Cache the response
        redisClient.setex(key, 3600, JSON.stringify(body)); // Expiry time of 1 hour
        res.sendResponse(body);  // Send the response
      };
      next();
    }
  });
};
