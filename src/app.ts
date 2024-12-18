import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import authRouter from './router/auth';
import userRouter from './router/users';
import postRouter from './router/post';
import asyncHandler from './middlewares/async';
import errorHandler from './middlewares/error';
import redis from 'redis';

const app = express();
const redisClient = redis.createClient();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Fix: Properly type the route handler
// app.get('/', (req: Request, res: Response) => {
//   return res.status(200).json({ message: "welcome" });
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.use(errorHandler);

export default app;

// Redis ( update catch when new db is updated )
// Learn db management/optimization