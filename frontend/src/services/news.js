import api from './api'

export const newsAPI = {
  getNews: async (params = {}) => {
    const response = await api.get('/news/', { params })
    return response.data
  },

  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}/`)
    return response.data
  },

  createNews: async (newsData) => {
    const response = await api.post('/news/create/', newsData)
    return response.data
  },

  updateNews: async (id, newsData) => {
    const response = await api.put(`/news/${id}/update/`, newsData)
    return response.data
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/news/${id}/delete/`)
    return response.data
  },
}