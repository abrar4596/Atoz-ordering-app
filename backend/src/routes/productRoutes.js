const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getTrendingProducts,
  getRelatedProducts
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/low-stock', protect, authorize('admin'), getLowStockProducts);
router.get('/trending', getTrendingProducts);
router.get('/:id/related', getRelatedProducts);

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
