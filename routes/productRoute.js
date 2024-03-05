import express from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import {
  createProduct,
  getAllProducts,
  getProducDetails,
  updateProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

//get
productRouter.get('/all', getAllProducts);
//productRouter.get('/single/:id', getProducDetails);
productRouter.route('/single/:id').get(getProducDetails).put(updateProduct);
productRouter.post('/new', isAuthenticated, singleUpload, createProduct);


export default productRouter;
