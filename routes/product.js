import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import {
  addCategory,
  addProductImage,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getProducDetails,
  updateProduct,
} from '../controllers/product.js';

const productRouter = express.Router();

//get
productRouter.get('/all', getAllProducts);
productRouter.get('/admin', isAuthenticated, isAdmin, getAdminProducts);
//productRouter.get('/single/:id', getProducDetails);
productRouter.post(
  '/new',
  isAuthenticated,
  isAdmin,
  singleUpload,
  createProduct
);
productRouter
  .route('/single/:id')
  .get(getProducDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);
productRouter
  .route('/images/:id')
  .post(isAuthenticated, isAdmin, singleUpload, addProductImage)
  .delete(isAuthenticated, isAdmin, deleteProductImage);

productRouter.post('/category', isAuthenticated, isAdmin, addCategory);
productRouter.get('/categories', isAuthenticated, getAllCategories);
productRouter.delete('/category/:id', isAuthenticated, isAdmin, deleteCategory);

export default productRouter;

//Ojo primero se debe autentica antes que sea admin, primero debe ir isAuthenticates y luego isAdmin en la ruta
