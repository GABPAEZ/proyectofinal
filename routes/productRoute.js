import express from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import {
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
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

export default productRouter;
