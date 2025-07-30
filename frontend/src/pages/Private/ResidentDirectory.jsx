import React from 'react'
import { Users, Search } from 'lucide-react'

const ResidentDirectory = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resident Directory</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search residents..."
            className="form-input pl-10"
          />
        </div>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Neighbor Directory</h2>
            <p className="text-gray-600">Connect with other residents</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Directory features coming soon...</p>
      </div>
    </div>
  )
}

export default ResidentDirectory