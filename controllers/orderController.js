import { asyncError } from '../middlewares/error.js';
import { Order } from '../models/orderSchema.js';
import { Product } from '../models/ProductSchema.js';

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
