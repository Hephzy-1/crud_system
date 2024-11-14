import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
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

// Fix: Properly type the route handler
app.get('/', (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "welcome" });
});

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', postRouter);

app.use(errorHandler);

export default app;

// Redis ( update catch when new db is updated )
// Learn db management/optimization