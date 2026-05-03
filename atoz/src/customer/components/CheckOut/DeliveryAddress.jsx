import React, { useState } from 'react';

const DeliveryAddress = ({ onNext, onBack, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phoneNumber: '',
    pincode: '',
    state: '',
    city: '',
    houseNo: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (must be 10 digits)';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode (must be 6 digits)';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.houseNo.trim()) newErrors.houseNo = 'House No / Street is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const InputField = ({ label, name, value, type = 'text', placeholder, error }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Delivery Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <InputField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            placeholder="e.g. John Doe"
            error={errors.fullName}
          />
          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            placeholder="10-digit mobile number"
            error={errors.phoneNumber}
          />
          <InputField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            placeholder="6-digit pincode"
            error={errors.pincode}
          />
          <InputField
            label="State"
            name="state"
            value={formData.state}
            placeholder="e.g. Maharashtra"
            error={errors.state}
          />
          <InputField
            label="City"
            name="city"
            value={formData.city}
            placeholder="e.g. Mumbai"
            error={errors.city}
          />
          <InputField
            label="House No / Street"
            name="houseNo"
            value={formData.houseNo}
            placeholder="House no, Building, Street name"
            error={errors.houseNo}
          />
          <InputField
            label="Landmark (Optional)"
            name="landmark"
            value={formData.landmark}
            placeholder="e.g. Near Apollo Hospital"
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 font-semibold border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-10 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryAddress;
