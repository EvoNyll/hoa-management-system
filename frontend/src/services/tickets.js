import api from './api'

export const ticketsAPI = {
  getCategories: async () => {
    const response = await api.get('/tickets/categories/')
    return response.data
  },

  getTickets: async (params = {}) => {
    const response = await api.get('/tickets/', { params })
    return response.data
  },

  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}/`)
    return response.data
  },

  createTicket: async (ticketData) => {
    const response = await api.post('/tickets/create/', ticketData)
    return response.data
  },

  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}/update/`, ticketData)
    return response.data
  },

  addComment: async (id, commentData) => {
    const response = await api.post(`/tickets/${id}/comment/`, commentData)
    return response.data
  },
}