const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc Get or create user cart and update totals
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
  
  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }
  
  return cart;
};

/**
 * @desc Recalculate cart totals
 */
const updateCartTotals = async (cart) => {
  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const item of cart.cartItems) {
    const product = item.product;
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    
    totalPrice += product.price * item.quantity;
    totalDiscountedPrice += price * item.quantity;
    totalItem += item.quantity;
    
    item.price = price; // Update current price in cart item
  }

  cart.totalPrice = totalPrice;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.totalItem = totalItem;
  cart.updatedAt = Date.now();
  
  await cart.save();
  return cart;
};

/**
 * @desc Add product to cart
 */
exports.addItemToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new ErrorResponse(`Only ${product.stock} items left in stock`, 400);
  }

  let cart = await getOrCreateCart(userId);

  const existingItemIndex = cart.cartItems.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item
    const newQty = cart.cartItems[existingItemIndex].quantity + quantity;
    if (product.stock < newQty) {
      throw new ErrorResponse(`Cannot add more. Total would exceed stock (${product.stock})`, 400);
    }
    cart.cartItems[existingItemIndex].quantity = newQty;
  } else {
    // Add new item
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    cart.cartItems.push({ product: productId, quantity, price });
  }

  // Refresh data for total calculation
  cart = await cart.populate('cartItems.product');
  return await updateCartTotals(cart);
};

/**
 * @desc Remove product from cart
 */
exports.removeItemFromCart = async (userId, productId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ErrorResponse('Cart not found', 404);
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  cart = await cart.populate('cartItems.product');
  return await updateCartTotals(cart);
};

/**
 * @desc Update item quantity in cart
 */
exports.updateItemQuantity = async (userId, productId, quantity) => {
  if (quantity < 1) {
    return await this.removeItemFromCart(userId, productId);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorResponse('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new ErrorResponse(`Insufficient stock. Only ${product.stock} available.`, 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ErrorResponse('Cart not found', 404);
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ErrorResponse('Product not in cart', 404);
  }

  cart.cartItems[itemIndex].quantity = quantity;

  cart = await cart.populate('cartItems.product');
  return await updateCartTotals(cart);
};

/**
 * @desc Get user cart
 */
exports.getUserCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return await updateCartTotals(cart);
};

/**
 * @desc Clear user cart
 */
exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.cartItems = [];
  cart.totalPrice = 0;
  cart.totalDiscountedPrice = 0;
  cart.totalItem = 0;
  
  await cart.save();
  return cart;
};
