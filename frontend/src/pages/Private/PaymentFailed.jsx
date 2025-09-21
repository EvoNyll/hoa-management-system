import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const alertContext = useAlert();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get pending payment data from sessionStorage
    const pendingPaymentData = sessionStorage.getItem('pendingPayment');

    if (pendingPaymentData) {
      try {
        const payment = JSON.parse(pendingPaymentData);
        setPaymentData(payment);

        // Keep the payment data for retry option
        // Don't clear it here as user might want to retry

        // Show error message safely
        if (alertContext && typeof alertContext.showError === 'function') {
          alertContext.showError('Payment failed. Please try again.');
        } else {
          console.log('❌ Payment failed. Please try again.');
        }

      } catch (error) {
        console.error('Failed to parse payment data:', error);
      }
    }
  }, [alertContext]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'gcash':
        return 'GCash';
      case 'paymaya':
        return 'Maya';
      case 'card':
        return 'Credit Card';
      default:
        return 'Payment Gateway';
    }
  };

  const handleRetryPayment = () => {
    // Navigate back to payments page with the payment data intact
    navigate('/payments');
  };

  const handleClearAndReturn = () => {
    // Clear the pending payment data and go back to payments
    sessionStorage.removeItem('pendingPayment');
    navigate('/payments');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Failed
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            We couldn't process your payment. This could be due to insufficient funds, network issues, or other technical problems.
          </p>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Failed Payment Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(paymentData.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getPaymentMethodDisplay(paymentData.paymentMethod)}
                  </span>
                </div>

                {paymentData.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Description:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-right max-w-xs truncate">
                      {paymentData.notes}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Attempt Time:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(paymentData.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {paymentData && (
              <button
                onClick={handleRetryPayment}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Payment
              </button>
            )}

            <button
              onClick={handleClearAndReturn}
              className="w-full btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payments
            </button>

            <Link
              to="/dashboard"
              className="w-full btn btn-secondary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Need Help?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you continue to experience issues, please contact our support team or try using a different payment method.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;