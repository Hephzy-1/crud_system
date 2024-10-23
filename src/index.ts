import express, { Application, Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import router from './router/index';
import asyncHandler from './middlewares/async';

const app: Application = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());

app.get('/', asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({ messgae: "Welcome"})
}));

app.use('/api/v1', router);

export default app;