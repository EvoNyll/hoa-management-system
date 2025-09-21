/**
 * Payment History Service
 * Manages local storage of payment history until backend integration
 */

const PAYMENT_HISTORY_KEY = 'hoa_payment_history';

// Helper function to generate unique payment ID
const generatePaymentId = () => {
  return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Helper function to format date for transaction ID
const formatTransactionDate = () => {
  return new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
};

const paymentHistoryService = {
  /**
   * Add a new payment to history
   * @param {Object} paymentData - Payment information
   * @returns {Object} - Created payment history record
   */
  addPayment: (paymentData) => {
    const paymentRecord = {
      id: generatePaymentId(),
      transactionId: `HOA_${formatTransactionDate()}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      amount: parseFloat(paymentData.amount),
      paymentType: paymentData.payment_type,
      paymentTypeName: paymentData.paymentTypeName || 'HOA Payment',
      paymentMethod: paymentData.paymentMethod || 'unknown',
      description: paymentData.notes || paymentData.description || '',
      status: paymentData.status || 'completed',
      gatewayPaymentId: paymentData.paymentId || null,
      gatewayReference: paymentData.gatewayReference || null,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      currency: 'PHP',
      fees: 0, // Could be calculated based on payment method
      netAmount: parseFloat(paymentData.amount),
      paymentMethodDisplay: paymentData.paymentMethodDisplay || paymentData.paymentMethod,
      isQuickPayment: paymentData.isQuickPayment || false,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        source: 'web_app'
      }
    };

    // Get existing history
    const existingHistory = paymentHistoryService.getPaymentHistory();

    // Add new payment at the beginning (most recent first)
    const updatedHistory = [paymentRecord, ...existingHistory];

    // Store updated history
    localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(updatedHistory));

    return paymentRecord;
  },

  /**
   * Get all payment history
   * @param {Object} filters - Optional filters
   * @returns {Array} - Array of payment records
   */
  getPaymentHistory: (filters = {}) => {
    try {
      const history = JSON.parse(localStorage.getItem(PAYMENT_HISTORY_KEY) || '[]');

      let filteredHistory = [...history];

      // Apply filters
      if (filters.status) {
        filteredHistory = filteredHistory.filter(payment => payment.status === filters.status);
      }

      if (filters.paymentMethod) {
        filteredHistory = filteredHistory.filter(payment => payment.paymentMethod === filters.paymentMethod);
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filteredHistory = filteredHistory.filter(payment => new Date(payment.createdAt) >= fromDate);
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filteredHistory = filteredHistory.filter(payment => new Date(payment.createdAt) <= toDate);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredHistory = filteredHistory.filter(payment =>
          payment.transactionId.toLowerCase().includes(searchTerm) ||
          payment.paymentTypeName.toLowerCase().includes(searchTerm) ||
          payment.description.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by date (most recent first)
      filteredHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return filteredHistory;
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  },

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Object|null} - Payment record or null
   */
  getPaymentById: (paymentId) => {
    const history = paymentHistoryService.getPaymentHistory();
    return history.find(payment => payment.id === paymentId) || null;
  },

  /**
   * Get payment statistics
   * @returns {Object} - Payment statistics
   */
  getPaymentStats: () => {
    const history = paymentHistoryService.getPaymentHistory();

    const totalPayments = history.length;
    const totalAmount = history.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = history.filter(p => p.status === 'completed').length;
    const pendingPayments = history.filter(p => p.status === 'pending').length;
    const failedPayments = history.filter(p => p.status === 'failed').length;

    // Get payments by method
    const paymentMethods = {};
    history.forEach(payment => {
      paymentMethods[payment.paymentMethod] = (paymentMethods[payment.paymentMethod] || 0) + 1;
    });

    // Get recent payments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = history.filter(payment => new Date(payment.createdAt) >= thirtyDaysAgo);

    return {
      totalPayments,
      totalAmount,
      completedPayments,
      pendingPayments,
      failedPayments,
      paymentMethods,
      recentPayments: recentPayments.length,
      averagePaymentAmount: totalPayments > 0 ? totalAmount / totalPayments : 0
    };
  },

  /**
   * Export payment history as JSON
   * @param {Object} filters - Optional filters
   * @returns {string} - JSON string of payment history
   */
  exportToJSON: (filters = {}) => {
    const history = paymentHistoryService.getPaymentHistory(filters);
    return JSON.stringify(history, null, 2);
  },

  /**
   * Export payment history as CSV
   * @param {Object} filters - Optional filters
   * @returns {string} - CSV string of payment history
   */
  exportToCSV: (filters = {}) => {
    const history = paymentHistoryService.getPaymentHistory(filters);

    if (history.length === 0) {
      return 'No payment data available';
    }

    const headers = [
      'Transaction ID',
      'Date',
      'Amount (PHP)',
      'Payment Type',
      'Payment Method',
      'Status',
      'Description',
      'Gateway Payment ID'
    ];

    const csvRows = [
      headers.join(','),
      ...history.map(payment => [
        payment.transactionId,
        new Date(payment.createdAt).toLocaleString(),
        payment.amount.toFixed(2),
        payment.paymentTypeName,
        payment.paymentMethodDisplay,
        payment.status,
        `"${payment.description.replace(/"/g, '""')}"`, // Escape quotes in description
        payment.gatewayPaymentId || ''
      ].join(','))
    ];

    return csvRows.join('\n');
  },

  /**
   * Clear all payment history
   */
  clearHistory: () => {
    localStorage.removeItem(PAYMENT_HISTORY_KEY);
  },

  /**
   * Update payment status (useful for pending payments)
   * @param {string} paymentId - Payment ID
   * @param {string} status - New status
   * @returns {boolean} - Success status
   */
  updatePaymentStatus: (paymentId, status) => {
    try {
      const history = paymentHistoryService.getPaymentHistory();
      const paymentIndex = history.findIndex(payment => payment.id === paymentId);

      if (paymentIndex === -1) {
        return false;
      }

      history[paymentIndex].status = status;
      history[paymentIndex].processedAt = new Date().toISOString();

      localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return false;
    }
  }
};

export default paymentHistoryService;