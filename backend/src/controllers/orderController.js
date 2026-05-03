const orderService = require('../services/orderService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new ErrorResponse('Please provide a shipping address', 400));
  }

  const order = await orderService.createOrder(req.user, shippingAddress);

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderService.findOrderById(req.params.id);

  // Check if order belongs to user or if user is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get current user's order history
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrderHistory = asyncHandler(async (req, res, next) => {
  const orders = await orderService.usersOrderHistory(req.user.id);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide an order status', 400));
  }

  const order = await orderService.updateOrderStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/admin/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await orderService.deleteOrder(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
