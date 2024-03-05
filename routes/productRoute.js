import express from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import {
  addCategory,
  addProductImage,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAllCategories,
  getAllProducts,
  getProducDetails,
  updateProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

//get
productRouter.get('/all', getAllProducts);
//productRouter.get('/single/:id', getProducDetails);
productRouter.post('/new', isAuthenticated, singleUpload, createProduct);
productRouter
  .route('/single/:id')
  .get(getProducDetails)
  .put(isAuthenticated, updateProduct)
  .delete(isAuthenticated, deleteProduct);
productRouter
  .route('/images/:id')
  .post(isAuthenticated, singleUpload, addProductImage)
  .delete(isAuthenticated, deleteProductImage);

productRouter.post('/category', isAuthenticated, addCategory);
productRouter.get('/categories', isAuthenticated, getAllCategories);
productRouter.delete('/category/:id', isAuthenticated, deleteCategory);

export default productRouter;
