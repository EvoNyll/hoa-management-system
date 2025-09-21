import React from 'react'
import { Vote, Plus, BarChart } from 'lucide-react'

const PollManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Poll Management</h1>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Vote className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Community Polls</h2>
            <p className="text-gray-600 dark:text-gray-400">Create and manage community surveys</p>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">Poll management features coming soon...</p>
      </div>
    </div>
  )
}

export default PollManagement