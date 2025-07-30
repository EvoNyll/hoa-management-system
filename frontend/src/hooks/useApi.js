import { useState, useEffect } from 'react'
import api from '../services/api'

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    method = 'GET',
    dependencies = [],
    immediate = true,
    ...requestOptions
  } = options

  const execute = async (customUrl = url, customOptions = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const config = {
        method,
        ...requestOptions,
        ...customOptions
      }

      const response = await api({
        url: customUrl,
        ...config
      })

      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate && url) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute()
  }
}

export const usePost = (url) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const post = async (data, customUrl = url) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.post(customUrl, data)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error }
}

export const usePut = (url) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const put = async (data, customUrl = url) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.put(customUrl, data)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { put, loading, error }
}

export const useDelete = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteRequest = async (url) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.delete(url)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { delete: deleteRequest, loading, error }
}

export default useApi