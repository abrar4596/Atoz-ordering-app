import React from 'react';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({ address, onNext, onBack }) => {
  const { cartItems, subtotal } = useCart();
  
  const deliveryCharges = subtotal > 500 ? 0 : 40;
  const discount = Math.round(subtotal * 0.1); // 10% discount for demo
  const totalAmount = subtotal - discount + deliveryCharges;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center justify-between">
            <span>Order Items ({cartItems.length})</span>
            <span className="text-blue-600 cursor-pointer text-sm font-medium hover:underline" onClick={onBack}>
              Edit Address
            </span>
          </h2>
          
          <div className="space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                    <img 
                      src={item.image || 'https://via.placeholder.com/150'} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        High quality gym supplement
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Qty: <strong>{item.quantity}</strong></span>
                        <span className="text-lg font-bold text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Your cart is empty.</p>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Go Shopping
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address Preview */}
        {address && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{address.fullName}</p>
              <p>{address.houseNo}, {address.city}</p>
              <p>{address.state} - {address.pincode}</p>
              <p className="pt-2"><strong>Phone:</strong> {address.phoneNumber}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Price Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (10% off)</span>
              <span>-₹{discount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges</span>
              <span className={deliveryCharges === 0 ? 'text-green-600' : ''}>
                {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
              </span>
            </div>
            <div className="border-t border-dashed pt-4 flex justify-between font-bold text-xl text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
            <p className="text-xs text-green-600 font-medium text-center bg-green-50 py-2 rounded">
              You will save ₹{discount} on this order
            </p>
            <button 
              onClick={onNext}
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition-all ${
                cartItems.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
