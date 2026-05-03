import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItemCard from '../Cart/CartItemCard';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const hasItems = cartItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {!hasItems ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                onDecrease={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-indigo-600">₹{subtotal}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
