const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc Create Razorpay Order
 */
exports.createRazorpayOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  const options = {
    amount: order.totalDiscountedPrice * 100, // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${order._id}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save razorpayOrderId to our database order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return razorpayOrder;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new ErrorResponse('Error creating payment order', 500);
  }
};

/**
 * @desc Verify Razorpay Signature
 */
exports.verifyPayment = async (orderId, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret')
    .update(body.toString())
    .digest('hex');

  const isSignatureValid = expectedSignature === razorpay_signature;

  if (isSignatureValid) {
    order.paymentStatus = 'COMPLETED';
    order.orderStatus = 'CONFIRMED';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();
    return order;
  } else {
    order.paymentStatus = 'FAILED';
    await order.save();
    throw new ErrorResponse('Payment verification failed', 400);
  }
};
