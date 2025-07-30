import { useState } from 'react'

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === 'checkbox' ? checked : value

    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle input blur (for touched state)
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate field on blur
    validateField(name, values[name])
  }

  // Validate a single field
  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName]
    if (!rules) return true

    let error = ''

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      error = rules.required === true ? `${fieldName} is required` : rules.required
    }

    // Min length validation
    if (!error && rules.minLength && value && value.length < rules.minLength) {
      error = `${fieldName} must be at least ${rules.minLength} characters`
    }

    // Max length validation
    if (!error && rules.maxLength && value && value.length > rules.maxLength) {
      error = `${fieldName} must be no more than ${rules.maxLength} characters`
    }

    // Email validation
    if (!error && rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address'
      }
    }

    // Phone validation
    if (!error && rules.phone && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        error = 'Please enter a valid phone number'
      }
    }

    // Custom validation function
    if (!error && rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values)
      if (customError) {
        error = customError
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))

    return !error
  }

  // Validate all fields
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = values[fieldName]
      const isFieldValid = validateField(fieldName, fieldValue)
      if (!isFieldValid) {
        isValid = false
      }
    })

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault()
      setIsSubmitting(true)

      // Mark all fields as touched
      const allTouched = {}
      Object.keys(validationRules).forEach(key => {
        allTouched[key] = true
      })
      setTouched(allTouched)

      // Validate form
      const isValid = validateForm()

      if (isValid && onSubmit) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }
  }

  // Reset form
  const reset = (newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  // Set form values
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Set form errors
  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  }
}

export default useForm