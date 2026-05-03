import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../customer/pages/HomePage/HomePage';
import Product from '../customer/components/Product/Product';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import CartPage from '../customer/components/Cart/CartPage';
import CheckOut from '../customer/components/CheckOut/CheckOut';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      </div>} />
    </Routes>
  );
};

export default AppRoutes;
