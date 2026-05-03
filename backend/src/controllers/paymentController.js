const paymentService = require('../services/paymentService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create Razorpay order
// @route   POST /api/payments/:orderId
// @access  Private
exports.createPaymentOrder = asyncHandler(async (req, res, next) => {
  const razorpayOrder = await paymentService.createRazorpayOrder(req.params.orderId);

  res.status(200).json({
    success: true,
    data: razorpayOrder
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify/:orderId
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const order = await paymentService.verifyPayment(req.params.orderId, req.body);

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    data: order
  });
});
