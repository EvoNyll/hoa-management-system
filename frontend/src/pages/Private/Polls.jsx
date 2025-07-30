import React from 'react'
import { Vote, BarChart } from 'lucide-react'

const Polls = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Polls</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Vote className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Community Voting</h2>
            <p className="text-gray-600">Participate in community decisions</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Polling features coming soon...</p>
      </div>
    </div>
  )
}

export default Polls