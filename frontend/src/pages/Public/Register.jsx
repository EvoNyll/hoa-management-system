import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import { useAlert } from '../../context/AlertContext'
import { InlineSpinner } from '../../components/common/LoadingSpinner'
import { Mail, Lock, Eye, EyeOff, Home, User, Phone, MapPin } from 'lucide-react'

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  full_name: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  phone: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  unit_number: Yup.string()
    .required('Unit number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { showError, showSuccess } = useAlert()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      full_name: '',
      phone: '',
      unit_number: '',
      password: '',
      password_confirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        await register(values)
        showSuccess('Registration successful! Please sign in with your credentials.')
        navigate('/login')
      } catch (error) {
        console.error('Registration error:', error)
        showError(error.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
  })

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
            Join Our Community
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`form-input pl-10 ${
                    formik.touched.username && formik.errors.username
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Choose a username"
                  {...formik.getFieldProps('username')}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="form-error">{formik.errors.username}</p>
              )}
            </div>

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
                    formik.touched.email && formik.errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Enter your email"
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="form-error">{formik.errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                className={`form-input ${
                  formik.touched.full_name && formik.errors.full_name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Enter your full name"
                {...formik.getFieldProps('full_name')}
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <p className="form-error">{formik.errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-input pl-10 ${
                    formik.touched.phone && formik.errors.phone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="(555) 123-4567"
                  {...formik.getFieldProps('phone')}
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="form-error">{formik.errors.phone}</p>
              )}
            </div>

            {/* Unit Number */}
            <div className="form-group">
              <label htmlFor="unit_number" className="form-label">
                Unit Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="unit_number"
                  name="unit_number"
                  type="text"
                  className={`form-input pl-10 ${
                    formik.touched.unit_number && formik.errors.unit_number
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="e.g., 101, A-24"
                  {...formik.getFieldProps('unit_number')}
                />
              </div>
              {formik.touched.unit_number && formik.errors.unit_number && (
                <p className="form-error">{formik.errors.unit_number}</p>
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
                  className={`form-input pl-10 pr-10 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Create a password"
                  {...formik.getFieldProps('password')}
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
              {formik.touched.password && formik.errors.password && (
                <p className="form-error">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="password_confirm" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 ${
                    formik.touched.password_confirm && formik.errors.password_confirm
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Confirm your password"
                  {...formik.getFieldProps('password_confirm')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.password_confirm && formik.errors.password_confirm && (
                <p className="form-error">{formik.errors.password_confirm}</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-green-600 hover:text-green-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:text-green-500">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading || !formik.isValid}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <InlineSpinner className="mr-2" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
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

export default Register