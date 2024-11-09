import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import authRouter from './router/auth';
import userRouter from './router/users';
import postRouter from './router/post';
import asyncHandler from './middlewares/async';
import errorHandler from './middlewares/error';

const app: Application = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req:Request, res:Response) => {
  return res.status(200).json({ message: "welcome"})
});

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', postRouter);

// Error Handler
app.use(errorHandler)

export default app;