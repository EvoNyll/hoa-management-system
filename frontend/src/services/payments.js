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
}