import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { CreditCard, DollarSign, MapPin, Save, Loader, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const FinancialSection = () => {
  const { profileData, loading, updateFinancialInfo } = useProfile();
  const [formData, setFormData] = useState({
    auto_pay_enabled: false,
    preferred_payment_method: 'credit_card',
    billing_address_different: false,
    billing_address: '',
    ...profileData.financial
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (profileData.financial) {
      setFormData(prev => ({
        ...prev,
        ...profileData.financial
      }));
    }
  }, [profileData.financial]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.billing_address_different && !formData.billing_address?.trim()) {
      newErrors.billing_address = 'Billing address is required when different from residence';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await updateFinancialInfo(formData);
      setSuccessMessage('Financial preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update financial preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { 
      value: 'credit_card', 
      label: 'Credit Card', 
      description: 'Visa, MasterCard, American Express, Discover',
      icon: CreditCard 
    },
    { 
      value: 'bank_account', 
      label: 'Bank Account (ACH)', 
      description: 'Direct bank transfer (may take 3-5 business days)',
      icon: DollarSign 
    },
    { 
      value: 'check', 
      label: 'Check', 
      description: 'Mail physical check (allow extra processing time)',
      icon: MapPin 
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Auto-Pay Settings */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Automatic Payment</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="auto_pay_enabled"
                name="auto_pay_enabled"
                type="checkbox"
                checked={formData.auto_pay_enabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="auto_pay_enabled" className="text-sm font-medium text-gray-900">
                Enable automatic HOA dues payment
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Automatically charge your preferred payment method when HOA dues are due. You'll receive email confirmation for each payment.
              </p>
            </div>
          </div>

          {formData.auto_pay_enabled && (
            <div className="ml-7 bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-green-700 font-medium">Auto-Pay Enabled</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your HOA dues will be automatically charged to your preferred payment method on the due date each month.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Preferences */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Preferred Payment Method</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose your preferred method for HOA dues and other payments. You can always select a different method during checkout.
          </p>
          
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div key={method.value} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`payment_${method.value}`}
                    name="preferred_payment_method"
                    type="radio"
                    value={method.value}
                    checked={formData.preferred_payment_method === method.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 text-gray-400 mr-2" />
                    <label htmlFor={`payment_${method.value}`} className="text-sm font-medium text-gray-900">
                      {method.label}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Address */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="billing_address_different"
                name="billing_address_different"
                type="checkbox"
                checked={formData.billing_address_different}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="billing_address_different" className="text-sm font-medium text-gray-900">
                My billing address is different from my residence address
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Check this box if you want invoices and payment receipts sent to a different address
              </p>
            </div>
          </div>

          {formData.billing_address_different && (
            <div className="mt-4">
              <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address *
              </label>
              <textarea
                id="billing_address"
                name="billing_address"
                value={formData.billing_address || ''}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.billing_address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter complete billing address including street, city, state, and ZIP code"
              />
              {errors.billing_address && <p className="text-xs text-red-600 mt-1">{errors.billing_address}</p>}
            </div>
          )}

          {!formData.billing_address_different && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-600">
                <strong>Current billing address:</strong> Your residence address on file will be used for billing and receipts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security & Information */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <Shield className="w-5 h-5 text-blue-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Payment Security</h4>
              <ul className="mt-1 text-xs text-blue-700 space-y-1">
                <li>• All payment information is encrypted and securely stored</li>
                <li>• We never store complete credit card numbers</li>
                <li>• Payment processing is handled by certified secure payment processors</li>
                <li>• You can update or remove payment methods at any time</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important Information</h4>
              <ul className="mt-1 text-xs text-yellow-700 space-y-1">
                <li>• Auto-pay charges occur 1-2 days before the due date</li>
                <li>• Failed payments will result in email notifications and late fees may apply</li>
                <li>• You can disable auto-pay at any time before the next billing cycle</li>
                <li>• Manual payments can be made even with auto-pay enabled</li>
                <li>• Payment method changes take effect immediately for future payments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment History Link */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Payment Management</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.location.href = '/payment-history'}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              View Payment History
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/payments'}
              className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              Make a Payment
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/payment-methods'}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
            >
              Manage Payment Methods
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Financial Settings'}
        </button>
      </div>
    </form>
  );
};

export default FinancialSection;