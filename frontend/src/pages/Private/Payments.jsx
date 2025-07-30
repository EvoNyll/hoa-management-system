import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import { useAlert } from '../../context/AlertContext'
import { paymentsAPI } from '../../services/payments'
import { PageSpinner, InlineSpinner } from '../../components/common/LoadingSpinner'
import { CreditCard, DollarSign, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const validationSchema = Yup.object({
  payment_type: Yup.string().required('Payment type is required'),
  payment_method: Yup.string().required('Payment method is required'),
  amount: Yup.number().positive('Amount must be positive').required('Amount is required')
})

const Payments = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useAlert()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentTypes, setPaymentTypes] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    loadPaymentData()
  }, [])

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
          payment_type: { name: 'Monthly HOA Dues' },
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
      payment_method: 'credit_card',
      amount: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true)
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        showSuccess('Payment submitted successfully! You will receive a confirmation email shortly.')
        resetForm()
        setShowPaymentForm(false)
        loadPaymentData() // Refresh data
        
      } catch (error) {
        console.error('Payment error:', error)
        showError('Payment failed. Please try again.')
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleQuickPay = async (paymentType) => {
    try {
      setSubmitting(true)
      
      // Simulate quick payment
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showSuccess(`Payment of $${paymentType.amount} for ${paymentType.name} submitted successfully!`)
      loadPaymentData()
      
    } catch (error) {
      showError('Quick payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading payment information..." />
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
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
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-2">
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
              onClick={() => setShowPaymentForm(!showPaymentForm)}
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-yellow-800">
                Outstanding Payments ({pendingPayments.length})
              </h3>
            </div>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{payment.payment_type.name}</h4>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${payment.amount}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                      <button
                        onClick={() => handleQuickPay(payment)}
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? <InlineSpinner className="mr-2" /> : null}
                        Pay Now
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
        <div className="mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Make a Payment</h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-500"
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
                        {type.name} - ${type.amount}
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
                    Amount ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
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
                  <label htmlFor="payment_method" className="form-label">
                    Payment Method
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    className="form-select"
                    {...formik.getFieldProps('payment_method')}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                  </select>
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
                  onClick={() => setShowPaymentForm(false)}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Payment Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentTypes.map((type) => (
            <div key={type.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="text-lg font-bold text-green-600">${type.amount}</span>
                    </div>
                    
                    {type.due_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Due Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(type.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        type.is_recurring 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {type.is_recurring ? 'Recurring' : 'One-time'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => handleQuickPay(type)}
                  disabled={submitting}
                  className="btn btn-primary w-full"
                >
                  {submitting ? <InlineSpinner className="mr-2" /> : null}
                  Pay ${type.amount}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600">
          <ul className="space-y-2">
            <li>• Payments are processed securely and you will receive email confirmation</li>
            <li>• Credit card payments are processed immediately</li>
            <li>• Bank transfers may take 1-3 business days to process</li>
            <li>• Late fees apply after the due date for monthly HOA dues</li>
            <li>• For questions about payments, contact the HOA office</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Payments