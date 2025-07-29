import api from './api'

export const pollsAPI = {
  getPolls: async (params = {}) => {
    const response = await api.get('/polls/', { params })
    return response.data
  },

  getPollById: async (id) => {
    const response = await api.get(`/polls/${id}/`)
    return response.data
  },

  createPoll: async (pollData) => {
    const response = await api.post('/polls/create/', pollData)
    return response.data
  },

  updatePoll: async (id, pollData) => {
    const response = await api.put(`/polls/${id}/update/`, pollData)
    return response.data
  },

  deletePoll: async (id) => {
    const response = await api.delete(`/polls/${id}/delete/`)
    return response.data
  },

  votePoll: async (id, voteData) => {
    const response = await api.post(`/polls/${id}/vote/`, voteData)
    return response.data
  },
}