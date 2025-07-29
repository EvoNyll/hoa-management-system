import api from './api'

export const eventsAPI = {
  getEvents: async (params = {}) => {
    const response = await api.get('/events/', { params })
    return response.data
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}/`)
    return response.data
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events/create/', eventData)
    return response.data
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}/update/`, eventData)
    return response.data
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}/delete/`)
    return response.data
  },

  rsvpEvent: async (id, rsvpData) => {
    const response = await api.post(`/events/${id}/rsvp/`, rsvpData)
    return response.data
  },
}