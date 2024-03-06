import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MOONGO_URI, { dbName : 'proyectofinal'});
    console.log(`Servidor conectado a la base de datos: ${connection.db.databaseName}, en la instancia de Mongo DB` );
  } catch (error) {
    console.log('Some error has been ocurred: ', error);
    process.exit(1);
  }
};
