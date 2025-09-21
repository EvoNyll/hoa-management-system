import api from './api'

export const paymentsAPI = {
  getPaymentTypes: async () => {
    const response = await api.get('/payments/types/')
    return response.data
  },

  getPayments: async (params = {}) => {
    const response = await api.get('/payments/', { params })
    return response.data
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}/`)
    return response.data
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments/create/', paymentData)
    return response.data
  },

  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process/', paymentData)
    return response.data
  },

  // Payment History functions
  getPaymentHistory: async (params = {}) => {
    const response = await api.get('/payments/history/', { params })
    return response.data
  },

  addPaymentHistory: async (historyData) => {
    const response = await api.post('/payments/history/', historyData)
    return response.data
  },

  getPaymentReceipt: async (paymentId) => {
    const response = await api.get(`/payments/history/${paymentId}/receipt/`)
    return response.data
  },

  exportPaymentHistory: async (params = {}) => {
    const response = await api.get('/payments/history/export/', {
      params,
      responseType: 'blob'
    })
    return response.data
  },
}