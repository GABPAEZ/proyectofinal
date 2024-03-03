import { app } from './app.js';
import { connectDb } from './data/database.js';

//conexion a la base de datos

connectDb();

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor escuchando en el puerto: ${process.env.PORT}, en modo: ${process.env.NODE_ENV}`
  );
});
