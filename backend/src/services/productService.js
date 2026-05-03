const Product = require('../models/Product');

/**
 * @desc Get products with filters, search, sort, and pagination
 */
exports.getProducts = async (queryString) => {
  const { keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 10 } = queryString;

  // Search by keyword
  const query = keyword ? {
    name: {
      $regex: keyword,
      $options: 'i'
    }
  } : {};

  // Filters
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Build the mongoose query
  let productsQuery = Product.find(query);

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    productsQuery = productsQuery.sort(sortBy);
  } else {
    productsQuery = productsQuery.sort('-createdAt');
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  productsQuery = productsQuery.skip(skip).limit(Number(limit));

  const products = await productsQuery;
  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  };
};

/**
 * @desc Get single product by ID
 */
exports.getProductById = async (id) => {
  return await Product.findById(id).populate('reviews.user', 'firstName lastName');
};

/**
 * @desc Create new product
 */
exports.createProduct = async (productData) => {
  return await Product.create(productData);
};

/**
 * @desc Update product
 */
exports.updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * @desc Delete product
 */
exports.deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await product.deleteOne();
  }
  return product;
};

/**
 * @desc Get low stock products
 */
exports.getLowStockProducts = async (threshold = 10) => {
  return await Product.find({ stock: { $lte: threshold } });
};

/**
 * @desc Get trending products based on salesCount
 */
exports.getTrendingProducts = async (limit = 5) => {
  return await Product.find().sort('-salesCount').limit(limit);
};

/**
 * @desc Get related products based on category
 */
exports.getRelatedProducts = async (productId, limit = 4) => {
  const product = await Product.findById(productId);
  if (!product) return [];
  
  return await Product.find({
    category: product.category,
    _id: { $ne: productId }
  }).limit(limit);
};
