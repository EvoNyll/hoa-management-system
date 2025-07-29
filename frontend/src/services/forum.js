import api from './api'

export const forumAPI = {
  getCategories: async () => {
    const response = await api.get('/forum/categories/')
    return response.data
  },

  getPosts: async (params = {}) => {
    const response = await api.get('/forum/posts/', { params })
    return response.data
  },

  getPostById: async (id) => {
    const response = await api.get(`/forum/posts/${id}/`)
    return response.data
  },

  createPost: async (postData) => {
    const response = await api.post('/forum/posts/create/', postData)
    return response.data
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/forum/posts/${id}/update/`, postData)
    return response.data
  },

  deletePost: async (id) => {
    const response = await api.delete(`/forum/posts/${id}/delete/`)
    return response.data
  },

  addReply: async (id, replyData) => {
    const response = await api.post(`/forum/posts/${id}/reply/`, replyData)
    return response.data
  },
}