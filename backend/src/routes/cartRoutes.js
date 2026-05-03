const express = require('express');
const {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// All cart routes are protected
router.use(protect);

router.get('/', getUserCart);
router.post('/add', addItemToCart);
router.put('/update', updateItemQuantity);
router.delete('/remove/:productId', removeItemFromCart);
router.delete('/clear', clearCart);

module.exports = router;
