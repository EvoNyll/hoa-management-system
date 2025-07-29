import api from './api'

export const cmsAPI = {
  getPages: async () => {
    const response = await api.get('/cms/pages/')
    return response.data
  },

  getPageBySlug: async (slug) => {
    const response = await api.get(`/cms/pages/${slug}/`)
    return response.data
  },

  createPage: async (pageData) => {
    const response = await api.post('/cms/pages/create/', pageData)
    return response.data
  },

  updatePage: async (slug, pageData) => {
    const response = await api.put(`/cms/pages/${slug}/update/`, pageData)
    return response.data
  },

  deletePage: async (slug) => {
    const response = await api.delete(`/cms/pages/${slug}/delete/`)
    return response.data
  },

  getContacts: async () => {
    const response = await api.get('/cms/contacts/')
    return response.data
  },

  getBoardMembers: async () => {
    const response = await api.get('/cms/board/')
    return response.data
  },

  createContact: async (contactData) => {
    const response = await api.post('/cms/contacts/create/', contactData)
    return response.data
  },

  updateContact: async (id, contactData) => {
    const response = await api.put(`/cms/contacts/${id}/update/`, contactData)
    return response.data
  },

  deleteContact: async (id) => {
    const response = await api.delete(`/cms/contacts/${id}/delete/`)
    return response.data
  },

  createBoardMember: async (memberData) => {
    const response = await api.post('/cms/board/create/', memberData)
    return response.data
  },

  updateBoardMember: async (id, memberData) => {
    const response = await api.put(`/cms/board/${id}/update/`, memberData)
    return response.data
  },

  deleteBoardMember: async (id) => {
    const response = await api.delete(`/cms/board/${id}/delete/`)
    return response.data
  },
}