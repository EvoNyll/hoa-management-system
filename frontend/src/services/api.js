import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

console.log('🔧 API Configuration:', {
  baseURL: API_URL,
  env: import.meta.env.VITE_API_URL
})

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor to add auth token and debug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Debug logging
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    })
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.error('❌ API Error:', {
      method: error.config?.method,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    // Handle 401 errors (unauthorized) - token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (!refreshToken) {
          console.log('🔄 No refresh token, redirecting to login')
          throw new Error('No refresh token available')
        }
        
        console.log('🔄 Attempting token refresh...')
        
        // Use full URL for refresh to avoid any URL construction issues
        const refreshResponse = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = refreshResponse.data
        localStorage.setItem('access_token', access)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        
        console.log('✅ Token refreshed, retrying request')
        
        return api(originalRequest)
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login') {
          console.log('🔄 Redirecting to login')
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api