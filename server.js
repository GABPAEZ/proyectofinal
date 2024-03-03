import { app } from './app.js';
import { connectDb } from './data/database.js';

//conexion a la base de datos

connectDb();

app.listen(process.env.PORT, () => {
  console.log(
    `Server listening on port: ${process.env.PORT}, in ${process.env.NODE_ENV} Mode`
  );
});
