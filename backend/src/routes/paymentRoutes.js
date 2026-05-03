const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/paymentController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/:orderId', createPaymentOrder);
router.post('/verify/:orderId', verifyPayment);

module.exports = router;
