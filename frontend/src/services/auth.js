import api from './api'

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/users/login/', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/users/register/', userData)
    return response.data
  },

  logout: async (refreshToken) => {
    const response = await api.post('/users/logout/', {
      refresh: refreshToken,
    })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/users/profile/')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile/update/', userData)
    return response.data
  },

  getDirectory: async () => {
    const response = await api.get('/users/directory/')
    return response.data
  },
}