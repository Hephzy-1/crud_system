import express, { Application } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import router from './router';

const app: Application = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const MONGO_URI = process.env.MONGO_URI;
mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);

mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router);
