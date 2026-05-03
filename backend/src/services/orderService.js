const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc Create order from cart
 */
exports.createOrder = async (user, shippingAddress) => {
  const cart = await Cart.findOne({ user: user._id }).populate('cartItems.product');

  if (!cart || cart.cartItems.length === 0) {
    throw new ErrorResponse('Cart is empty', 400);
  }

  // Validate stock for all items
  for (const item of cart.cartItems) {
    if (item.product.stock < item.quantity) {
      throw new ErrorResponse(`Insufficient stock for product: ${item.product.name}`, 400);
    }
  }

  // Create order items from cart items
  const orderItems = cart.cartItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
  }));

  // Create order
  const order = await Order.create({
    user: user._id,
    orderItems,
    shippingAddress,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.totalPrice - cart.totalDiscountedPrice,
    totalItem: cart.totalItem,
  });

  // Reduce stock and update sales count
  for (const item of cart.cartItems) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, salesCount: item.quantity }
    });
  }

  // Clear cart after order
  cart.cartItems = [];
  cart.totalPrice = 0;
  cart.totalDiscountedPrice = 0;
  cart.totalItem = 0;
  await cart.save();

  return order;
};

/**
 * @desc Get order by ID
 */
exports.findOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'firstName lastName email')
    .populate('orderItems.product');

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  return order;
};

/**
 * @desc Get user's order history
 */
exports.usersOrderHistory = async (userId) => {
  return await Order.find({ user: userId })
    .populate('orderItems.product')
    .sort('-createdAt');
};

/**
 * @desc Get all orders (Admin)
 */
exports.getAllOrders = async () => {
  return await Order.find()
    .populate('user', 'firstName lastName email')
    .populate('orderItems.product')
    .sort('-createdAt');
};

/**
 * @desc Update order status (Admin)
 */
exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  order.orderStatus = status;

  // Handle inventory if order is cancelled
  if (status === 'CANCELLED') {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, salesCount: -item.quantity }
      });
    }
  }

  return await order.save();
};

/**
 * @desc Delete order (Admin)
 */
exports.deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (order) {
    await order.deleteOne();
  }
  return order;
};
