import React from 'react'
import { DollarSign, TrendingUp, Download } from 'lucide-react'

const PaymentManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <button className="btn btn-outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <DollarSign className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            <p className="text-gray-600">Track payments and financial reports</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Payment management features coming soon...</p>
      </div>
    </div>
  )
}

export default PaymentManagement