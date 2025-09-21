import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, AlertCircle, Copy, Smartphone } from 'lucide-react';
import { checkPaymentStatus } from '../../services/paymentGateway';

const QRCodeModal = ({ isOpen, onClose, qrData, paymentData }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Waiting for payment...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !qrData) return;

    // Calculate time remaining
    const expiresAt = new Date(qrData.expiresAt);
    const now = new Date();
    const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
    setTimeRemaining(timeLeft);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setStatusMessage('QR code has expired. Please generate a new one.');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check payment status periodically
    const statusChecker = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(qrData.id);

        if (status.status === 'succeeded') {
          setPaymentStatus('completed');
          setStatusMessage('Payment successful! Redirecting...');
          clearInterval(statusChecker);
          clearInterval(timer);

          // Store payment data for success page
          sessionStorage.setItem('pendingPayment', JSON.stringify({
            ...paymentData,
            paymentId: qrData.id,
            timestamp: new Date().toISOString(),
            paymentMethod: 'instapay'
          }));

          // Redirect to success page after a short delay
          setTimeout(() => {
            window.location.href = '/payment-success';
          }, 2000);

        } else if (status.status === 'failed') {
          setPaymentStatus('failed');
          setStatusMessage('Payment failed. Please try again.');
          clearInterval(statusChecker);
          clearInterval(timer);
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => {
      clearInterval(timer);
      clearInterval(statusChecker);
    };
  }, [isOpen, qrData, paymentData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (!isOpen || !qrData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            InstaPay QR Code
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Status */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium">{statusMessage}</span>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining > 0 && (
            <div className="text-center mb-6">
              <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time remaining
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg shadow-inner mb-6 flex justify-center">
            <img
              src={qrData.qrCodeImage ? `data:image/png;base64,${qrData.qrCodeImage}` : ''}
              alt="InstaPay QR Code"
              className="w-64 h-64 object-contain"
              onError={(e) => {
                console.error('Failed to load QR code image:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(paymentData.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Description:</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right max-w-xs truncate">
                  {paymentData.notes || paymentData.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Payment ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-gray-900 dark:text-white">
                    {qrData.id.slice(-8)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(qrData.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  How to Pay
                </h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Open your bank or e-wallet app</li>
                  <li>2. Look for "Scan QR" or "QR Pay" feature</li>
                  <li>3. Scan the QR code above</li>
                  <li>4. Confirm the payment amount</li>
                  <li>5. Complete the payment</li>
                </ol>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Works with all major Philippine banks and e-wallets (GCash, Maya, BDO, BPI, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Copy notification */}
          {copied && (
            <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm text-center rounded-lg">
              Payment ID copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;