import express from 'express';
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  processOrders,
} from '../controllers/orderController.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post('/new', isAuthenticated, createOrder);
orderRouter.get('/admin', isAuthenticated, isAdmin, getAdminOrders);
orderRouter.get('/my', isAuthenticated, getMyOrders);
orderRouter
  .route('/single/:id')
  .get(isAuthenticated, getOrderDetails)
  .put(isAuthenticated, isAdmin, processOrders);

export default orderRouter;
