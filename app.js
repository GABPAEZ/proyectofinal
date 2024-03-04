import { config } from 'dotenv';
import express from 'express';
import userRouter from './routes/UserRoute.js';
import { errorMiddleware } from './middlewares/error.js';

config({
  path: './data/config.env',
});

export const app = express();

//middeleware

app.use(express.json());

//rutas

app.get('/', (req, res, next) => {
  res.send('working');
});

//relacionadas al usuario, login, registro
app.use('/api/v1/user', userRouter);

//error middleware

app.use(errorMiddleware);
