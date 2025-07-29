import api from './api'

export const bookingsAPI = {
  getFacilities: async () => {
    const response = await api.get('/bookings/facilities/')
    return response.data
  },

  getFacilityById: async (id) => {
    const response = await api.get(`/bookings/facilities/${id}/`)
    return response.data
  },

  getBookings: async (params = {}) => {
    const response = await api.get('/bookings/', { params })
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}/`)
    return response.data
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create/', bookingData)
    return response.data
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}/update/`, bookingData)
    return response.data
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}/delete/`)
    return response.data
  },
}