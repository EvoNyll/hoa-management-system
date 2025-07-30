import React from 'react'
import { CreditCard, Download } from 'lucide-react'

const PaymentHistory = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <button className="btn btn-outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <CreditCard className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <p className="text-gray-600">View all your past payments and receipts</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Payment history features coming soon...</p>
      </div>
    </div>
  )
}

export default PaymentHistory