const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error');

// Route files
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('AtoZ MERN App Backend API');
});

// Use centralized error handler
app.use(errorHandler);

module.exports = { app };