import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutModal = ({ isOpen, onClose, cartTotal }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    isDefault: false
  });

  // Initialize with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cod' && cartTotal > 5000) {
      toast.error('Cash on Delivery is not available for orders above $5000');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Save address to user profile if isDefault is true
      // 2. Create order in backend
      // 3. Process payment if not COD
      
      setStep(3); // Success step
      
      // If COD, show success immediately
      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully! You will receive a confirmation call.');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div className={`flex flex-col items-center ${stepNum <= step ? 'text-[#425A8B]' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              stepNum < step ? 'bg-[#425A8B] border-[#425A8B] text-white' :
              stepNum === step ? 'border-[#425A8B] bg-white text-[#425A8B]' :
              'border-gray-300 bg-white text-gray-400'
            }`}>
              {stepNum < step ? <CheckCircle size={20} /> : stepNum}
            </div>
            <span className="text-sm mt-2">
              {stepNum === 1 ? 'Delivery' : stepNum === 2 ? 'Payment' : 'Confirm'}
            </span>
          </div>
          {stepNum < 3 && (
            <div className={`w-24 h-1 mx-2 ${stepNum < step ? 'bg-[#425A8B]' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={step === 3 ? onClose : undefined}
        />

        {/* Modal Container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#425A8B]">
                {step === 1 ? 'Delivery Information' : 
                 step === 2 ? 'Payment Method' : 
                 'Order Confirmed!'}
              </h2>
              {step !== 3 && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {renderStepIndicator()}

              {/* Step 1: Delivery Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <MapPin size={20} />
                      <span className="font-medium">Add delivery address</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      Please provide accurate information for smooth delivery
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">+1</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter 10-digit phone number"
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="House number, street name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="Nearby landmark"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                        placeholder="Enter ZIP code"
                        maxLength="6"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#425A8B] focus:ring-[#425A8B] border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Save as default address
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <CreditCard size={20} />
                      <span className="font-medium">Select payment method</span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-[#425A8B] bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'border-[#425A8B] bg-[#425A8B]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-medium">Cash on Delivery</span>
                          <p className="text-sm text-gray-600">
                            Pay when you receive your order
                          </p>
                          {cartTotal > 5000 && (
                            <p className="text-sm text-red-600 mt-1">
                              Not available for orders above $5000
                            </p>
                          )}
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                        disabled={cartTotal > 5000}
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#425A8B] bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-[#425A8B] bg-[#425A8B]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-medium">Credit/Debit Card</span>
                          <p className="text-sm text-gray-600">
                            Pay securely with your card
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                    </label>

                    <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'paypal' ? 'border-[#425A8B] bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'paypal' ? 'border-[#425A8B] bg-[#425A8B]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'paypal' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-medium">PayPal</span>
                          <p className="text-sm text-gray-600">
                            Pay with your PayPal account
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${(cartTotal * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-[#425A8B]">
                            ${(cartTotal * 1.1).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading || (paymentMethod === 'cod' && cartTotal > 5000)}
                      className="px-6 py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Order Confirmed!
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Thank you for your order. Your order number is <span className="font-bold">ORD{Date.now().toString().slice(-8)}</span>
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = '/orders';
                      }}
                      className="w-full py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] transition-colors"
                    >
                      View Order Details
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 border border-[#425A8B] text-[#425A8B] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;