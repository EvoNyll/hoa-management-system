import api from './api'

export const authAPI = {
  login: async (credentials) => {
    try {
      // Ensure clean data structure
      const loginData = {
        email: credentials.email?.trim(),
        password: credentials.password
      }
      
      console.log('🔐 Login attempt:', { 
        email: loginData.email,
        hasPassword: !!loginData.password 
      })
      
      const response = await api.post('/users/login/', loginData)
      
      console.log('✅ Login successful:', {
        hasAccess: !!response.data.access,
        hasRefresh: !!response.data.refresh,
        user: response.data.user
      })
      
      return response.data
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      // Extract meaningful error message
      let errorMessage = 'Login failed'
      
      if (error.response?.data) {
        const data = error.response.data
        if (data.error) {
          errorMessage = data.error
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors
        } else if (data.email) {
          errorMessage = `Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`
        } else if (data.password) {
          errorMessage = `Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the server is running.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.'
      }
      
      throw new Error(errorMessage)
    }
  },

  register: async (userData) => {
    try {
      const registerData = {
        email: userData.email?.trim(),
        password: userData.password,
        full_name: userData.full_name?.trim(),
        role: userData.role || 'member'
      }
      
      console.log('📝 Registration attempt:', { 
        email: registerData.email, 
        full_name: registerData.full_name,
        role: registerData.role
      })
      
      const response = await api.post('/users/register/', registerData)
      
      console.log('✅ Registration successful')
      
      return response.data
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message)
      
      let errorMessage = 'Registration failed'
      
      if (error.response?.data) {
        const data = error.response.data
        if (data.error) {
          errorMessage = data.error
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.email) {
          errorMessage = `Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`
        } else if (data.password) {
          errorMessage = `Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`
        } else if (data.full_name) {
          errorMessage = `Name: ${Array.isArray(data.full_name) ? data.full_name[0] : data.full_name}`
        }
      }
      
      throw new Error(errorMessage)
    }
  },

  logout: async (refreshToken) => {
    try {
      console.log('🚪 Logout attempt')
      
      const response = await api.post('/users/logout/', {
        refresh: refreshToken,
      })
      
      console.log('✅ Logout successful')
      return response.data
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Don't throw error for logout - just log it and return success
      return { message: 'Logged out locally' }
    }
  },

  getProfile: async () => {
    try {
      console.log('👤 Fetching profile')
      
      const response = await api.get('/users/profile/')
      
      console.log('✅ Profile fetched successfully')
      return response.data
    } catch (error) {
      console.error('❌ Profile fetch failed:', error)
      throw error
    }
  },

  updateProfile: async (userData) => {
    try {
      console.log('👤 Updating profile')
      
      const response = await api.put('/users/profile/', userData)
      
      console.log('✅ Profile updated successfully')
      return response.data
    } catch (error) {
      console.error('❌ Profile update failed:', error)
      throw error
    }
  },

  getDirectory: async () => {
    try {
      console.log('📁 Fetching directory')
      
      const response = await api.get('/users/directory/')
      
      console.log('✅ Directory fetched successfully')
      return response.data
    } catch (error) {
      console.error('❌ Directory fetch failed:', error)
      throw error
    }
  },
}