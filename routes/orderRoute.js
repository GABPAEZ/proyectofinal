import express from 'express'
import { createOrder } from '../controllers/orderController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post('/new', isAuthenticated,createOrder);




export default orderRouter;