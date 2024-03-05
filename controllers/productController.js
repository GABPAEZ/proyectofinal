//import { asyncError} from '../middleware.error.js'
import { asyncError } from '../middlewares/error.js';
import { Product } from '../models/ProductSchema.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { getDataUri, sendEmail } from '../utils/features.js';
import cloudinary from 'cloudinary';

export const getAllProducts = async (req, res, next) => {
  //buscar y query una categoria
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

//=================== Un Producto ==================//

export const getProducDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler('Producto no encontrado', 404));

  res.status(200).json({
    success: true,
    product,
  });
});

//=================== Crear un Producto ==================//

export const createProduct = asyncError(async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!name) return next(new ErrorHandler('Por favor ingrese un nombre', 404));
  if (!description)
    return next(new ErrorHandler('Por favor ingrese una descripción', 404));
  if (!price) return next(new ErrorHandler('Por favor ingrese un precio', 404));
  if (!stock) return next(new ErrorHandler('Por favor ingrese un stock', 404));
  if (!req.file) return next(new ErrorHandler('Por favor ingrese una imagen'));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  try {
    await Product.create({ name, description, price, stock, images: [image] });
    next(new ErrorHandler('Producto creado con exito', 201));
  } catch (error) {
    next(new ErrorHandler('Producto no creado', 400));
  }

  res.status(200).json({
    success: true,
    message: 'Producto creado exitosamente',
  });
});

//=================== Actualizar un Producto ==================//

export const updateProduct = asyncError(async (req, res, next) => {

  


  res.status(200).json({
    success: true,
    mensaje: 'El producto ha sido actualizado',
  });
});
