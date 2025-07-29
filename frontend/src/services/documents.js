import api from './api'

export const documentsAPI = {
  getCategories: async () => {
    const response = await api.get('/documents/categories/')
    return response.data
  },

  getDocuments: async (params = {}) => {
    const response = await api.get('/documents/', { params })
    return response.data
  },

  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}/`)
    return response.data
  },

  createDocument: async (documentData) => {
    const formData = new FormData()
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key])
    })
    
    const response = await api.post('/documents/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updateDocument: async (id, documentData) => {
    const response = await api.put(`/documents/${id}/update/`, documentData)
    return response.data
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}/delete/`)
    return response.data
  },
}