import { app } from './app.js';
import { connectDb } from './data/database.js';
import { v2 as cloudinary } from 'cloudinary';
import Stripe from 'stripe';
//conexion a la base de datos

connectDb();

export const stripe = new Stripe(process.env.STRIPE_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor escuchando en el puerto: ${process.env.PORT}, en modo: ${process.env.NODE_ENV}`
  );
});
