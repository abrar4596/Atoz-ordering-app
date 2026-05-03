import React, { useState, useEffect } from 'react';
import DeliveryAddress from './DeliveryAddress';
import OrderSummary from './OrderSummary';

const steps = ['Login', 'Delivery Address', 'Order Summary', 'Payment'];

const CheckOut = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState(null);

  // Persist checkout state (optional bonus)
  useEffect(() => {
    const savedStep = localStorage.getItem('checkout_step');
    const savedAddress = localStorage.getItem('checkout_address');
    if (savedStep) setActiveStep(parseInt(savedStep));
    if (savedAddress) setAddressData(JSON.parse(savedAddress));
  }, []);

  useEffect(() => {
    localStorage.setItem('checkout_step', activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    if (addressData) {
      localStorage.setItem('checkout_address', JSON.stringify(addressData));
    }
  }, [addressData]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressSubmit = (data) => {
    setAddressData(data);
    handleNext();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                    activeStep >= index 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {activeStep > index ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${activeStep >= index ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                    activeStep > index ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ marginTop: '-2rem' }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {activeStep === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="text-gray-600 mb-6">You are already logged in as <strong>Guest User</strong>.</p>
            <button 
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Delivery Address
            </button>
          </div>
        )}

        {activeStep === 1 && (
          <DeliveryAddress 
            onNext={handleAddressSubmit} 
            onBack={handleBack}
            initialData={addressData}
          />
        )}

        {activeStep === 2 && (
          <OrderSummary 
            address={addressData}
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {activeStep === 3 && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center">Payment Options</h2>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="border rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-500 transition-colors">
                <input type="radio" name="payment" id="card" className="w-4 h-4 text-blue-600" />
                <label htmlFor="card" className="ml-3 font-medium text-gray-700">Credit / Debit Card</label>
              </div>
              <div className="border rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-500 transition-colors">
                <input type="radio" name="payment" id="upi" className="w-4 h-4 text-blue-600" />
                <label htmlFor="upi" className="ml-3 font-medium text-gray-700">UPI (Google Pay, PhonePe, etc.)</label>
              </div>
              <div className="border rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-500 transition-colors">
                <input type="radio" name="payment" id="cod" className="w-4 h-4 text-blue-600" />
                <label htmlFor="cod" className="ml-3 font-medium text-gray-700">Cash on Delivery</label>
              </div>
              <button 
                onClick={() => alert('Order Placed Successfully!')}
                className="w-full mt-6 bg-green-600 text-white py-4 rounded-md font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Complete Payment
              </button>
              <button 
                onClick={handleBack}
                className="w-full mt-2 text-blue-600 font-medium hover:underline"
              >
                Go Back to Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
