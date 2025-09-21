import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Home } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import paymentHistoryService from '../../services/paymentHistory';

const PaymentSuccess = () => {
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

        // Record payment in history for gateway payments
        if (payment.paymentId) {
          const gatewayPaymentHistoryData = {
            ...payment,
            paymentTypeName: payment.notes?.includes('Quick Payment') ?
              payment.notes.replace('Quick Payment: ', '') : 'HOA Payment',
            status: 'completed',
            gatewayPaymentId: payment.paymentId,
            gatewayReference: payment.paymentId
          };

          const historyRecord = paymentHistoryService.addPayment(gatewayPaymentHistoryData);
          console.log('✅ Gateway payment recorded in history:', historyRecord);
        }

        // Clear the pending payment data
        sessionStorage.removeItem('pendingPayment');

        // Show success message safely
        if (alertContext && typeof alertContext.showSuccess === 'function') {
          alertContext.showSuccess('Payment completed successfully!');
        } else {
          console.log('✅ Payment completed successfully!');
        }

      } catch (error) {
        console.error('Failed to parse payment data:', error);
      }
    }

    // Auto redirect to payments page after 10 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/payments');
    }, 10000);

    return () => clearTimeout(redirectTimer);
  }, [navigate, alertContext]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Details
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
                  <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {paymentData.paymentId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(paymentData.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/payments"
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Payments
            </Link>

            <Link
              to="/payment-history"
              className="w-full btn btn-outline flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              View Payment History
            </Link>
          </div>

          {/* Auto redirect notice */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            You will be automatically redirected to payments page in 10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;