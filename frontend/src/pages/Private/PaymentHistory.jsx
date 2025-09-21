import React, { useState, useEffect } from 'react'
import {
  CreditCard, Download, Search, Filter, Calendar,
  CheckCircle, Clock, AlertCircle, DollarSign,
  Eye, FileText, ArrowUpDown, TrendingUp
} from 'lucide-react'
import paymentHistoryService from '../../services/paymentHistory'

const PaymentHistory = () => {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadPaymentHistory()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payments, searchTerm, statusFilter, methodFilter, dateFilter, sortBy, sortOrder])

  const loadPaymentHistory = () => {
    try {
      setLoading(true)
      const history = paymentHistoryService.getPaymentHistory()
      const statistics = paymentHistoryService.getPaymentStats()

      setPayments(history)
      setStats(statistics)
      console.log('📊 Payment statistics:', statistics)
    } catch (error) {
      console.error('Failed to load payment history:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...payments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    // Payment method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      let filterDate = new Date()

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        default:
          break
      }

      if (dateFilter !== 'all') {
        filtered = filtered.filter(payment => new Date(payment.createdAt) >= filterDate)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'method':
          aValue = a.paymentMethodDisplay
          bValue = b.paymentMethodDisplay
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default: // date
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredPayments(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExport = (format = 'csv') => {
    try {
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentMethod: methodFilter !== 'all' ? methodFilter : undefined,
        search: searchTerm || undefined
      }

      let exportData
      let filename
      let mimeType

      if (format === 'csv') {
        exportData = paymentHistoryService.exportToCSV(filters)
        filename = `payment-history-${new Date().toISOString().slice(0, 10)}.csv`
        mimeType = 'text/csv'
      } else {
        exportData = paymentHistoryService.exportToJSON(filters)
        filename = `payment-history-${new Date().toISOString().slice(0, 10)}.json`
        mimeType = 'application/json'
      }

      const blob = new Blob([exportData], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // Get unique payment methods for filter
  const paymentMethods = [...new Set(payments.map(p => p.paymentMethod))].filter(Boolean)

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#358939]"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading payment history...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {payments.length} total transactions • {formatCurrency(stats.totalAmount || 0)} total
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalAmount || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedPayments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingPayments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.averagePaymentAmount || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
            className="form-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="status-asc">Status A-Z</option>
            <option value="method-asc">Method A-Z</option>
          </select>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredPayments.length} of {payments.length} transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            {payments.length === 0 ? (
              <div>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No payments yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your payment history will appear here once you make your first payment.
                </p>
                <a href="/payments" className="btn btn-primary">
                  Make a Payment
                </a>
              </div>
            ) : (
              <div>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    onClick={() => toggleSort('date')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('method')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Payment Method</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 dark:text-white">
                        {payment.transactionId}
                      </div>
                      {payment.gatewayPaymentId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Gateway: {payment.gatewayPaymentId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.paymentTypeName}
                      </div>
                      {payment.isQuickPayment && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          Quick Pay
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.paymentMethodDisplay || payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {payment.description || 'No description'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistory