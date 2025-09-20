import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { CreditCard, DollarSign, MapPin, Save, Loader, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const FinancialSection = () => {
  const { profileData, loading, updateFinancialInfo } = useProfile();
  const [formData, setFormData] = useState({
    preferred_payment_method: 'payment_wallet',
    wallet_provider: 'gcash',
    wallet_account_number: '',
    wallet_account_name: '',
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

    // Wallet validation
    if (formData.preferred_payment_method === 'payment_wallet') {
      if (!formData.wallet_account_number?.trim()) {
        newErrors.wallet_account_number = 'Wallet account number is required';
      } else {
        // Validate GCash number format (Philippine mobile number: +63XXXXXXXXXX or 09XXXXXXXXX)
        const phoneRegex = formData.wallet_provider === 'gcash'
          ? /^(\+63|63|0)?9\d{9}$/
          : /^(\+63|63|0)?9\d{9}$/; // Maya also uses mobile numbers

        if (!phoneRegex.test(formData.wallet_account_number.replace(/\s|-/g, ''))) {
          newErrors.wallet_account_number = `Invalid ${formData.wallet_provider === 'gcash' ? 'GCash' : 'Maya'} mobile number format`;
        }
      }

      if (!formData.wallet_account_name?.trim()) {
        newErrors.wallet_account_name = 'Account holder name is required';
      }
    }

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
      const walletMessage = formData.preferred_payment_method === 'payment_wallet'
        ? `${formData.wallet_provider === 'gcash' ? 'GCash' : 'Maya'} wallet linked successfully!`
        : 'Financial preferences updated successfully!';
      setSuccessMessage(walletMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update financial preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    {
      value: 'payment_wallet',
      label: 'Payment Wallet',
      description: 'Use your digital payment wallet for secure transactions',
      icon: CreditCard
    },
    {
      value: 'qr_code',
      label: 'InstaPay QR Code',
      description: 'Receive InstaPay QR codes for secure mobile payments',
      icon: DollarSign
    }
  ];

  const walletProviders = [
    {
      value: 'gcash',
      label: 'GCash',
      description: 'The #1 Finance App in the Philippines',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      logo: '💙', // You can replace with actual GCash logo
    },
    {
      value: 'maya',
      label: 'Maya',
      description: 'Bank-grade security for digital payments',
      color: 'bg-green-600',
      textColor: 'text-green-600',
      logo: '💚', // You can replace with actual Maya logo
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

      {/* Payment Wallet Configuration */}
      {formData.preferred_payment_method === 'payment_wallet' && (
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Payment Wallet Setup</h3>
          </div>

          <div className="space-y-6">
            {/* Wallet Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Wallet Provider <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletProviders.map((provider) => (
                  <div key={provider.value} className="relative">
                    <input
                      id={`wallet_${provider.value}`}
                      name="wallet_provider"
                      type="radio"
                      value={provider.value}
                      checked={formData.wallet_provider === provider.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`wallet_${provider.value}`}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.wallet_provider === provider.value
                          ? `border-blue-500 ${provider.color} bg-opacity-10`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.logo}</span>
                        <div>
                          <div className={`font-semibold ${
                            formData.wallet_provider === provider.value ? provider.textColor : 'text-gray-900'
                          }`}>
                            {provider.label}
                          </div>
                          <div className="text-xs text-gray-500">{provider.description}</div>
                        </div>
                      </div>
                      {formData.wallet_provider === provider.value && (
                        <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wallet_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.wallet_provider === 'gcash' ? 'GCash' : 'Maya'} Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="wallet_account_number"
                  name="wallet_account_number"
                  type="tel"
                  value={formData.wallet_account_number}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.wallet_account_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={formData.wallet_provider === 'gcash' ? '+63 9XX XXX XXXX' : '+63 9XX XXX XXXX'}
                />
                {errors.wallet_account_number && (
                  <p className="text-xs text-red-600 mt-1">{errors.wallet_account_number}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter the mobile number linked to your {formData.wallet_provider === 'gcash' ? 'GCash' : 'Maya'} account
                </p>
              </div>

              <div>
                <label htmlFor="wallet_account_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="wallet_account_name"
                  name="wallet_account_name"
                  type="text"
                  value={formData.wallet_account_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.wallet_account_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name as registered"
                />
                {errors.wallet_account_name && (
                  <p className="text-xs text-red-600 mt-1">{errors.wallet_account_name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Must match the name registered to your wallet account
                </p>
              </div>
            </div>

            {/* Wallet Information */}
            <div className={`p-4 rounded-lg border ${
              formData.wallet_provider === 'gcash' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start">
                <span className="text-lg mr-3">
                  {formData.wallet_provider === 'gcash' ? '💙' : '💚'}
                </span>
                <div>
                  <h4 className={`font-medium ${
                    formData.wallet_provider === 'gcash' ? 'text-blue-900' : 'text-green-900'
                  }`}>
                    {formData.wallet_provider === 'gcash' ? 'About GCash' : 'About Maya'}
                  </h4>
                  <ul className={`mt-1 text-xs space-y-1 ${
                    formData.wallet_provider === 'gcash' ? 'text-blue-700' : 'text-green-700'
                  }`}>
                    {formData.wallet_provider === 'gcash' ? (
                      <>
                        <li>• Instantly send and receive money</li>
                        <li>• Cash-in at over 15,000 partner outlets nationwide</li>
                        <li>• Bank-grade security with 24/7 fraud monitoring</li>
                        <li>• AMLA-compliant and BSP-supervised</li>
                      </>
                    ) : (
                      <>
                        <li>• Powered by PayMaya Philippines, Inc.</li>
                        <li>• EMV and PCI-DSS certified for security</li>
                        <li>• Available in over 7,000 cities and municipalities</li>
                        <li>• Regulated by BSP as an Electronic Money Issuer</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Payment Configuration */}
      {formData.preferred_payment_method === 'qr_code' && (
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">InstaPay QR Code Setup</h3>
          </div>

          <div className="space-y-6">
            {/* QR Code Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white border-2 border-green-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">
                    How InstaPay QR Code Payments Work
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                      <p className="text-sm text-green-800">
                        When you have a payment due, we'll send you a <strong>unique InstaPay QR code</strong> via email and SMS
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                      <p className="text-sm text-green-800">
                        Open any InstaPay-enabled app (GCash, Maya, BPI, BDO, UnionBank, etc.) and scan the QR code
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                      <p className="text-sm text-green-800">
                        Review the payment details and confirm the transaction in your banking/wallet app
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                      <p className="text-sm text-green-800">
                        Your payment is processed instantly and you'll receive a confirmation receipt
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* InstaPay Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-lg mr-3">🏦</span>
                <div>
                  <h4 className="font-medium text-blue-900">About InstaPay</h4>
                  <ul className="mt-1 text-xs text-blue-700 space-y-1">
                    <li>• Real-time electronic fund transfer service by BSP</li>
                    <li>• Works with all major Philippine banks and e-wallets</li>
                    <li>• Available 24/7, including weekends and holidays</li>
                    <li>• Secure, fast, and convenient digital payments</li>
                    <li>• Maximum transaction limit of ₱50,000 per day</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Compatible Apps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Compatible Banking Apps & E-Wallets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span>💙</span>
                  <span className="text-gray-700">GCash</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💚</span>
                  <span className="text-gray-700">Maya</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔵</span>
                  <span className="text-gray-700">BPI Mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔴</span>
                  <span className="text-gray-700">BDO Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🟡</span>
                  <span className="text-gray-700">UnionBank</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🟢</span>
                  <span className="text-gray-700">Metrobank</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🟠</span>
                  <span className="text-gray-700">Landbank</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⚪</span>
                  <span className="text-gray-700">PNB Mobile</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                And many more InstaPay-enabled banks and e-wallets
              </p>
            </div>

            {/* QR Code Delivery Options */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">QR Code Delivery</h4>
                  <ul className="mt-1 text-xs text-yellow-800 space-y-1">
                    <li>• QR codes will be sent to your registered email address</li>
                    <li>• SMS notifications will include a link to view the QR code</li>
                    <li>• QR codes are unique for each payment and expire after 24 hours</li>
                    <li>• You can also access QR codes through your account dashboard</li>
                    <li>• For security, QR codes cannot be reused or shared</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <li>• GCash and Maya use bank-grade security with BSP regulation</li>
                <li>• Payment processing follows PCI-DSS compliance standards</li>
                <li>• We never store your wallet credentials or sensitive information</li>
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
                <li>• Ensure your {formData.preferred_payment_method === 'payment_wallet' ? 'wallet has sufficient balance' : 'payment method is active'}</li>
                <li>• Failed payments will result in email notifications and late fees may apply</li>
                <li>• Manual payments can be made through your account dashboard</li>
                {formData.preferred_payment_method === 'payment_wallet' && (
                  <>
                    <li>• GCash/Maya payments are processed instantly</li>
                    <li>• You'll receive SMS confirmation from your wallet provider</li>
                  </>
                )}
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