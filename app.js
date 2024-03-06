import { config } from 'dotenv';
import express from 'express';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';

import { errorMiddleware } from './middlewares/error.js';
import cookieparser from 'cookie-parser';
import cors from 'cors';

config({
  path: './data/config.env',
});

export const app = express();

//middeleware

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    credential: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //origin: '*',
    origin:[process.env.FRONTEND_URI_1, process.env.FRONTEND_URI_2]
  })
);

//rutas

app.get('/', (req, res, next) => {
  res.send('working');
});

//relacionadas al usuario, login, registro
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);

//error middleware

app.use(errorMiddleware);
