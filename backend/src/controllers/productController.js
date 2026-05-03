const productService = require('../services/productService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    success: true,
    count: result.products.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await productService.getProductById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.deleteProduct(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private/Admin
exports.getLowStockProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getLowStockProducts();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
exports.getTrendingProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getTrendingProducts();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getRelatedProducts(req.params.id);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});
