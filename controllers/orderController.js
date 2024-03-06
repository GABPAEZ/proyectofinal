import { asyncError } from '../middlewares/error.js';
import { Order } from '../models/orderSchema.js';
import { Product } from '../models/productSchema.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { stripe } from '../server.js';

//=========================sTRIPE =================================//

export const processPayment = asyncError(async (req, res, next) => {
  const { totalAmount } = req.body;
  const { client_secret } = await stripe.paymentIntents.create({
    amount: Number(totalAmount),
    currency: 'usd',
  });
  res.status(200).json({
    success: true,
    client_secret,
  });
});

//========================= Crear una Orden ==========================//

export const createOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethods,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
  } = req.body;

  await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentMethods,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
  });

  for (let index = 0; index < orderItems.length; index++) {
    const product = await Product.findById(orderItems[index].product);
    product.stock -= orderItems[index].quantity;
    await product.save();
  }

  res.status(200).json({
    success: true,
    message: 'Order colocada, gracias!!',
  });
});

//========================== todas la ordenes =======================================/

export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

//=========================== mis ordenes ============================================//

export const getMyOrders = asyncError(async (req, res, next) => {
  const myorders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    myorders,
  });
});

//=========================== mis ordenes ============================================//

export const getOrderDetails = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler('Orden no encontrada', 404));
  res.status(200).json({
    success: true,
    order,
  });
});

//=========================== update ordenes ============================================//

export const processOrders = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler('Orden no encontrada', 404));

  if (order.orderStatus === 'Preparing') order.orderStatus = 'Shipped';
  else if (order.orderStatus === 'Shipped') {
    order.orderStatus = 'Delivered';
    order.deliveredAt = new Date(Date.now());
  } else return next(new ErrorHandler('Orden ya despachada', 400));

  await order.save();
  //localhost:5000/api/v1/order/single/65e7649a1dd7e7fd916a46a0
  http: res.status(200).json({
    success: true,
    message: 'Orden procesada en forma exitosa',
  });
});
