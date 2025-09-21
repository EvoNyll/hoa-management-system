import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { useAuth } from '../../context/AuthContext'
import { showError, showSuccess } from '../../utils/toast'
import { InlineSpinner } from '../../components/common/LoadingSpinner'
import { Home, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  // Debug logging
  console.log('Login component render:', { isAuthenticated, user, loading })

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: isAuthenticated ? 'present' : 'none' })
    if (isAuthenticated) {
      console.log('Navigating to:', from)
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const validationRules = {
    email: {
      required: 'Email is required',
      email: true
    },
    password: {
      required: 'Password is required',
      minLength: 6
    }
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useForm(
    {
      email: '',
      password: ''
    },
    validationRules
  )

  // Create our own isValid check that works properly
  const isFormValid = () => {
    // Check if required fields have values
    const hasRequiredValues = values.email && values.password
    
    // Check if there are any current errors
    const hasNoErrors = Object.keys(errors).every(key => !errors[key])
    
    return hasRequiredValues && hasNoErrors
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    // Validate the form first
    const isValid = Object.keys(validationRules).every(fieldName => {
      const fieldValue = values[fieldName]
      if (validationRules[fieldName]?.required && (!fieldValue || fieldValue.toString().trim() === '')) {
        return false
      }
      if (validationRules[fieldName]?.email && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(fieldValue)
      }
      if (validationRules[fieldName]?.minLength && fieldValue && fieldValue.length < validationRules[fieldName].minLength) {
        return false
      }
      return true
    })

    if (isValid) {
      await onSubmit(values)
    }
  }

  const onSubmit = async (formValues) => {
    try {
      console.log('Attempting login with:', formValues)
      const response = await login(formValues)
      console.log('Login response:', response)
      console.log('Auth tokens in localStorage:', {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token')
      })
      showSuccess('Login successful!')
      // Navigation will be handled by the useEffect when isAuthenticated becomes true
    } catch (error) {
      console.error('Login error:', error)
      showError(error.response?.data?.message || 'Invalid email or password')
    }
  }

  // Helper function to fill form with test credentials
  const fillCredentials = (email, password) => {
    setFieldValue('email', email)
    setFieldValue('password', password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Greenfield HOA</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input pl-10 ${
                    touched.email && errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.email && errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input pl-10 pr-10 ${
                    touched.password && errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <InlineSpinner className="mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Test credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Test Login Credentials:</h4>
            <div className="text-xs text-blue-800 space-y-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@hoamanagement.com', 'admin123')}
                className="block w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
              >
                <strong>Admin:</strong> admin@hoamanagement.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('member@test.com', 'member123')}
                className="block w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
              >
                <strong>Member:</strong> member@test.com / member123
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('guest@test.com', 'guest123')}
                className="block w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
              >
                <strong>Guest:</strong> guest@test.com / guest123
              </button>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Click on any credential to auto-fill the form
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login