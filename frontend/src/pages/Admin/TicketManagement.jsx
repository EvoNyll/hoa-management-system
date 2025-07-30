import React from 'react'
import { Wrench, Filter, MessageSquare } from 'lucide-react'

const TicketManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
        <button className="btn btn-outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Wrench className="w-8 h-8 text-orange-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
            <p className="text-gray-600">Manage maintenance and support requests</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Ticket management features coming soon...</p>
      </div>
    </div>
  )
}

export default TicketManagement