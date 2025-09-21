import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import { useAlert } from '../../context/AlertContext'
import { useProfile } from '../../context/ProfileContext'
import { paymentsAPI } from '../../services/payments'
import { processPayment, redirectToPaymentGateway, getPaymentMethodType, createInstapayQRCode } from '../../services/paymentGateway'
import paymentHistoryService from '../../services/paymentHistory'
import { PageSpinner, InlineSpinner } from '../../components/common/LoadingSpinner'
import QRCodeModal from '../../components/modals/QRCodeModal'
import { CreditCard, DollarSign, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const validationSchema = Yup.object({
  payment_type: Yup.string().required('Payment type is required'),
  amount: Yup.number().positive('Amount must be positive').required('Amount is required')
})

const Payments = () => {
  const { user, isAuthenticated } = useAuth()
  const { showSuccess, showError } = useAlert()
  const { profileData, loading: profileLoading, loadProfileData } = useProfile()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentTypes, setPaymentTypes] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [qrPaymentData, setQrPaymentData] = useState(null)

  // Get user's preferred payment method for backend submission
  const getUserPreferredPaymentMethod = () => {
    const financialData = profileData?.financial

    // If no preferred payment method is set, we should not proceed with payment
    if (!financialData?.preferred_payment_method) {
      return null
    }

    return financialData.preferred_payment_method
  }

  // Get readable name for user's preferred payment method from profile
  const getUserPaymentMethodDisplay = () => {
    // Show loading state if profile is still loading
    if (profileLoading && !profileData?.financial) {
      return 'Loading payment method...'
    }

    const financialData = profileData?.financial

    // Log for debugging
    console.log('🔍 Payment method display - Financial data:', financialData)

    if (financialData?.preferred_payment_method === 'payment_wallet') {
      const provider = financialData?.wallet_provider === 'maya' ? 'Maya' : 'GCash'
      const accountNumber = financialData?.wallet_account_number
      return accountNumber ? `${provider} (${accountNumber})` : provider
    } else if (financialData?.preferred_payment_method === 'qr_code') {
      return 'InstaPay QR Code'
    }

    // If profile is loaded but no preferred method is set, prompt user to configure
    if (profileData?.financial !== undefined) {
      return 'Please set your preferred payment method'
    }

    // If profile data is not yet available, show loading
    return 'Loading payment method...'
  }


  useEffect(() => {
    loadPaymentData()
  }, [])

  // Load profile data when user is authenticated
  useEffect(() => {
    if (user && isAuthenticated && loadProfileData) {
      console.log('🔄 Loading profile data for payment method display...')
      loadProfileData()
    }
  }, [user, isAuthenticated, loadProfileData])

  // Debug profile data changes
  useEffect(() => {
    console.log('🔄 Profile data updated:', profileData?.financial)
  }, [profileData?.financial])

  const loadPaymentData = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock payment types
      setPaymentTypes([
        {
          id: 1,
          name: 'Monthly HOA Dues',
          description: 'Regular monthly homeowners association fees',
          amount: '250.00',
          is_recurring: true,
          due_date: '2024-08-01'
        },
        {
          id: 2,
          name: 'Pool Maintenance Fee',
          description: 'Annual pool maintenance contribution',
          amount: '75.00',
          is_recurring: false,
          due_date: '2024-07-15'
        },
        {
          id: 3,
          name: 'Late Fee',
          description: 'Late payment penalty',
          amount: '25.00',
          is_recurring: false,
          due_date: '2024-07-30'
        }
      ])

      // Mock pending payments
      setPendingPayments([
        {
          id: 1,
          payment_type: { id: 1, name: 'Monthly HOA Dues' },
          amount: '250.00',
          status: 'pending',
          due_date: '2024-08-01'
        }
      ])

    } catch (error) {
      console.error('Failed to load payment data:', error)
      showError('Failed to load payment information')
    } finally {
      setLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      payment_type: '',
      amount: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true)

        // Check if user has configured a payment method
        const userPaymentMethod = getUserPreferredPaymentMethod()
        if (!userPaymentMethod) {
          if (showError && typeof showError === 'function') {
            showError('Please configure your preferred payment method in Financial Settings first.')
          } else {
            console.error('Please configure your preferred payment method in Financial Settings first.')
          }
          return
        }

        // Get payment method type from user's profile
        const paymentMethodType = getPaymentMethodType(profileData)

        console.log('Processing payment with method type:', paymentMethodType, 'Profile data:', profileData?.financial)

        // Check if user has GCash, Maya, or InstaPay QR as preferred method
        if (paymentMethodType === 'gcash' || paymentMethodType === 'paymaya' || paymentMethodType === 'qrph' || paymentMethodType === 'instapay') {
          // Create payment data
          const paymentGatewayData = {
            amount: values.amount,
            description: `${paymentTypes.find(pt => pt.id.toString() === values.payment_type)?.name || 'HOA Payment'} - ${values.notes || ''}`.trim(),
            currency: 'PHP'
          }

          console.log('🔄 Creating payment session for:', paymentMethodType)

          // Handle InstaPay QR Code
          if (paymentMethodType === 'qrph' || paymentMethodType === 'instapay') {
            const qrResult = await createInstapayQRCode(paymentGatewayData)

            if (qrResult) {
              console.log('✅ InstaPay QR code generated successfully')

              // Set QR data and payment data for modal
              setQrData(qrResult)
              setQrPaymentData({
                ...values,
                amount: values.amount,
                notes: values.notes,
                description: paymentGatewayData.description
              })

              // Show QR modal
              setShowQRModal(true)
              return // Exit here as user will scan QR code
            }
          } else {
            // Handle GCash and Maya redirects
            const paymentResult = await processPayment(paymentGatewayData, profileData)

            if (paymentResult.checkoutUrl) {
              console.log('✅ Redirecting to payment gateway:', paymentResult.checkoutUrl)

              // Store payment data in sessionStorage for tracking
              sessionStorage.setItem('pendingPayment', JSON.stringify({
                ...values,
                paymentId: paymentResult.id,
                paymentMethod: paymentMethodType,
                timestamp: new Date().toISOString()
              }))

              // Redirect to payment gateway
              redirectToPaymentGateway(paymentResult.checkoutUrl)
              return // Exit here as user will be redirected
            }
          }
        }

        // Fallback for credit card or other payment methods
        // Include payment method from user's profile
        const paymentData = {
          ...values,
          payment_method: getUserPreferredPaymentMethod()
        }

        console.log('Submitting payment with data:', paymentData)

        // Simulate payment processing for non-gateway methods
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Record payment in history
        const selectedPaymentType = paymentTypes.find(pt => pt.id.toString() === values.payment_type)
        const paymentHistoryData = {
          ...values,
          paymentTypeName: selectedPaymentType?.name || 'HOA Payment',
          paymentMethod: getUserPreferredPaymentMethod(),
          paymentMethodDisplay: getUserPaymentMethodDisplay(),
          status: 'completed'
        }

        const historyRecord = paymentHistoryService.addPayment(paymentHistoryData)
        console.log('✅ Payment recorded in history:', historyRecord)

        if (showSuccess && typeof showSuccess === 'function') {
          showSuccess(`Payment submitted successfully! Transaction ID: ${historyRecord.transactionId}`)
        }
        resetForm()
        setShowPaymentForm(false)
        loadPaymentData() // Refresh data

      } catch (error) {
        console.error('Payment error:', error)
        if (showError && typeof showError === 'function') {
          showError(error.message || 'Payment failed. Please try again.')
        } else {
          console.error('Payment failed:', error.message || 'Payment failed. Please try again.')
        }
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleQuickPay = async (paymentType) => {
    try {
      setSubmitting(true)

      // Check if user has configured a payment method
      const userPaymentMethod = getUserPreferredPaymentMethod()
      if (!userPaymentMethod) {
        showError('Please configure your preferred payment method in Financial Settings first.')
        return
      }

      // Get payment method type from user's profile
      const paymentMethodType = getPaymentMethodType(profileData)

      console.log('Quick payment with method type:', paymentMethodType)

      // Check if user has GCash, Maya, or InstaPay QR as preferred method
      if (paymentMethodType === 'gcash' || paymentMethodType === 'paymaya' || paymentMethodType === 'qrph' || paymentMethodType === 'instapay') {
        // Create payment gateway session data
        const paymentGatewayData = {
          amount: paymentType.amount,
          description: `Quick Payment: ${paymentType.name}`,
          currency: 'PHP'
        }

        console.log('🔄 Creating quick payment session for:', paymentMethodType)

        // Handle InstaPay QR Code
        if (paymentMethodType === 'qrph' || paymentMethodType === 'instapay') {
          const qrResult = await createInstapayQRCode(paymentGatewayData)

          if (qrResult) {
            console.log('✅ InstaPay QR code generated for quick payment')

            // Set QR data and payment data for modal
            setQrData(qrResult)
            setQrPaymentData({
              payment_type: paymentType.id.toString(),
              amount: paymentType.amount,
              notes: `Quick Payment: ${paymentType.name}`,
              description: paymentGatewayData.description,
              isQuickPayment: true
            })

            // Show QR modal
            setShowQRModal(true)
            return // Exit here as user will scan QR code
          }
        } else {
          // Handle GCash and Maya redirects
          const paymentResult = await processPayment(paymentGatewayData, profileData)

          if (paymentResult.checkoutUrl) {
            console.log('✅ Redirecting to payment gateway for quick payment:', paymentResult.checkoutUrl)

            // Store payment data in sessionStorage for tracking
            sessionStorage.setItem('pendingPayment', JSON.stringify({
              payment_type: paymentType.id.toString(),
              amount: paymentType.amount,
              notes: `Quick Payment: ${paymentType.name}`,
              paymentId: paymentResult.id,
              paymentMethod: paymentMethodType,
              timestamp: new Date().toISOString(),
              isQuickPayment: true
            }))

            // Redirect to payment gateway
            redirectToPaymentGateway(paymentResult.checkoutUrl)
            return // Exit here as user will be redirected
          }
        }
      }

      // Fallback for credit card or other payment methods
      // Simulate quick payment
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Record quick payment in history
      const quickPaymentHistoryData = {
        payment_type: paymentType.id.toString(),
        amount: paymentType.amount,
        notes: `Quick Payment: ${paymentType.name}`,
        paymentTypeName: paymentType.name,
        paymentMethod: getUserPreferredPaymentMethod(),
        paymentMethodDisplay: getUserPaymentMethodDisplay(),
        status: 'completed',
        isQuickPayment: true
      }

      const historyRecord = paymentHistoryService.addPayment(quickPaymentHistoryData)
      console.log('✅ Quick payment recorded in history:', historyRecord)

      if (showSuccess && typeof showSuccess === 'function') {
        showSuccess(`Payment of ₱${paymentType.amount} for ${paymentType.name} submitted successfully! Transaction ID: ${historyRecord.transactionId}`)
      }
      loadPaymentData()

    } catch (error) {
      console.error('Quick payment error:', error)
      showError(error.message || 'Quick payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const clearPaymentForm = () => {
    // Reset form to initial values
    formik.resetForm({
      values: {
        payment_type: '',
        amount: '',
        notes: ''
      }
    })
  }

  const handleMakePayment = (paymentData) => {
    // Pre-fill the form with payment data
    formik.setValues({
      payment_type: paymentData.id?.toString() || paymentData.payment_type?.id?.toString() || '',
      amount: paymentData.amount || '',
      notes: `Payment for ${paymentData.name || paymentData.payment_type?.name || ''}`
    })

    // Show the payment form
    setShowPaymentForm(true)

    // Scroll to the form
    setTimeout(() => {
      const formElement = document.querySelector('#payment-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleShowBlankPaymentForm = () => {
    // Clear the form first
    clearPaymentForm()

    // Show the payment form
    setShowPaymentForm(true)

    // Scroll to the form
    setTimeout(() => {
      const formElement = document.querySelector('#payment-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  if (loading) {
    return <PageSpinner text="Loading payment information..." />
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300', icon: Clock },
      processing: { color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300', icon: Clock },
      completed: { color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300', icon: CheckCircle },
      failed: { color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300', icon: AlertCircle }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your HOA payments and view payment history
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/payment-history"
              className="btn btn-outline"
            >
              View History
            </Link>
            <button
              onClick={handleShowBlankPaymentForm}
              className="btn btn-primary"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* Pending Payments Alert */}
      {pendingPayments.length > 0 && (
        <div className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                Outstanding Payments ({pendingPayments.length})
              </h3>
            </div>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{payment.payment_type.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₱{payment.amount}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                      <button
                        onClick={() => handleMakePayment(payment)}
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ₱{payment.amount}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <div id="payment-form" className="mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Make a Payment</h3>
              <button
                onClick={() => {
                  clearPaymentForm()
                  setShowPaymentForm(false)
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Type */}
                <div className="form-group">
                  <label htmlFor="payment_type" className="form-label">
                    Payment Type
                  </label>
                  <select
                    id="payment_type"
                    name="payment_type"
                    className={`form-select ${
                      formik.touched.payment_type && formik.errors.payment_type
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : ''
                    }`}
                    {...formik.getFieldProps('payment_type')}
                    onChange={(e) => {
                      formik.handleChange(e)
                      const selectedType = paymentTypes.find(type => type.id.toString() === e.target.value)
                      if (selectedType) {
                        formik.setFieldValue('amount', selectedType.amount)
                      }
                    }}
                  >
                    <option value="">Select payment type</option>
                    {paymentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ₱{type.amount}
                      </option>
                    ))}
                  </select>
                  {formik.touched.payment_type && formik.errors.payment_type && (
                    <p className="form-error">{formik.errors.payment_type}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label htmlFor="amount" className="form-label">
                    Amount (₱)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 dark:text-gray-500 font-medium">₱</span>
                    </div>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      className={`form-input pl-10 ${
                        formik.touched.amount && formik.errors.amount
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : ''
                      }`}
                      placeholder="0.00"
                      {...formik.getFieldProps('amount')}
                    />
                  </div>
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="form-error">{formik.errors.amount}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label className="form-label">
                    Payment Method
                  </label>
                  <div className="relative">
                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{getUserPaymentMethodDisplay()}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full">
                          From Profile
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Payment method from your </span>
                      <Link
                        to="/account#financial"
                        className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                        onClick={() => {
                          // Store the tab preference in sessionStorage for the Account page to pick up
                          sessionStorage.setItem('accountActiveTab', 'financial');
                        }}
                      >
                        Financial Settings
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="form-textarea"
                    placeholder="Additional notes or comments"
                    {...formik.getFieldProps('notes')}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    clearPaymentForm()
                    setShowPaymentForm(false)
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formik.isValid}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <InlineSpinner className="mr-2" />
                      Processing...
                    </div>
                  ) : (
                    'Submit Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Available Payment Types */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Payment Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentTypes.map((type) => (
            <div key={type.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{type.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{type.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">₱{type.amount}</span>
                    </div>
                    
                    {type.due_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(type.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        type.is_recurring
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {type.is_recurring ? 'Recurring' : 'One-time'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => handleMakePayment(type)}
                  disabled={submitting}
                  className="btn btn-primary w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₱{type.amount}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Information</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
          <ul className="space-y-2">
            <li>• Payments are processed securely and you will receive email confirmation</li>
            <li>• Credit card payments are processed immediately</li>
            <li>• Bank transfers may take 1-3 business days to process</li>
            <li>• Late fees apply after the due date for monthly HOA dues</li>
            <li>• For questions about payments, contact the HOA office</li>
          </ul>
        </div>
      </div>

      {/* InstaPay QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false)
          setQrData(null)
          setQrPaymentData(null)
        }}
        qrData={qrData}
        paymentData={qrPaymentData}
      />
    </div>
  )
}

export default Payments