const cartService = require('../services/cartService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartService.getUserCart(req.user.id);

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return next(new ErrorResponse('Please provide a product ID', 400));
  }

  const cart = await cartService.addItemToCart(req.user.id, productId, quantity || 1);

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartService.removeItemFromCart(req.user.id, req.params.productId);

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return next(new ErrorResponse('Please provide a product ID and quantity', 400));
  }

  const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear user's cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartService.clearCart(req.user.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
