const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrderHistory,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All order routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/user', getUserOrderHistory);
router.get('/:id', getOrderById);

// Admin only routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/admin/:id/status', authorize('admin'), updateOrderStatus);
router.delete('/admin/:id', authorize('admin'), deleteOrder);

module.exports = router;
