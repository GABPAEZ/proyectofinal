//import { asyncError} from '../middleware.error.js'
import { asyncError } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import { Category } from '../models/category.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { getDataUri, sendEmail } from '../utils/features.js';
import cloudinary from 'cloudinary';

export const getAllProducts = async (req, res, next) => {
  //buscar y query una categoria

  const { keyword, category } = req.query;

  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : '',
      $options: 'i',
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
};

//=============== Get Admin Products ================//

export const getAdminProducts = async (req, res, next) => {
  //buscar y query una categoria
  const products = await Product.find({}).populate('category');

  const outOfStock = products.filter((i) => i.stock === 0);

  res.status(200).json({
    success: true,
    products,
    outOfStock: outOfStock.length,
    inStock: products.length - outOfStock.length,
  });
};

//=================== Un Producto ==================//

export const getProducDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category');

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
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Producto no encontrado', 404));
  const { name, description, price, stock, category } = req.body;
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  res.status(200).json({
    success: true,
    mensaje: 'El producto ha sido actualizado',
  });
});

//====================== Agregar imagenes de productos ==============================//

export const addProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Producto no encontrado', 404));

  if (!req.file) return next(new ErrorHandler('Por favor ingrese una imagen'));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  product.images.push(image);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Imagen agregada exitosamente',
  });
});

//====================== Borra imagenes de productos ==============================//

export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Producto no encontrado', 404));

  const id = req.query.id;

  if (!id)
    return next(
      new ErrorHandler('Por favor ingrese la identificacion de la imagen', 400)
    );

  let isExist = -1; //va a determinar la posicion de la imagen dentro del array si existe da la posicion, caso contrario -1

  product.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  //console.log(isExist);

  if (isExist < 0) return next(new ErrorHandler('La imagen no existe', 400));

  await cloudinary.uploader.destroy(product.images[isExist].public_id);

  product.images.splice(isExist, 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Imagen borrada exitosamente',
  });
});

//====================== Borra producto ==============================//

export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Producto no encontrado', 404));

  //elimina todas imagenes que haya en el producto y luego eliminaos
  for (let index = 0; index < product.images.length; index++) {
    await cloudinary.uploader.destroy(product.images[index].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Producto borrado exitosamente',
  });
});

//====================== crear categoria ==============================//

export const addCategory = asyncError(async (req, res, next) => {
  const { category } = req.body;

  await Category.create({ category });

  res.status(200).json({
    success: true,
    message: 'Categoria creada exitosamente',
  });
});

//====================== traer todas las categorias ==============================//

export const getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

//====================== borrar  categorias ==============================//

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorHandler('Categoria no encontrada', 404));

  //buscar todos los productos que estan en la categoria para limpiar antes de eliminar

  const products = await Category.find({ category: category._id });

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    product.category = undefined;
    await product.save();
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Categoria borrada exitosamente',
  });
});
