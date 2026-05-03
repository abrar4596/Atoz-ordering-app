const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['protein', 'vitamins', 'medicines', 'pre-workout', 'creatine', 'gainer', 'others'],
    index: true,
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    index: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0,
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String },
    }
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  prescriptionRequired: {
    type: Boolean,
    default: false,
  },
  salesCount: {
    type: Number,
    default: 0,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for better filtering performance
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ brand: 1, price: 1 });

module.exports = mongoose.model('Product', ProductSchema);
