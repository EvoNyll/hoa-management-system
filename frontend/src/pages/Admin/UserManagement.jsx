import React from 'react'
import { Users, Plus, Search } from 'lucide-react'

const UserManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="form-input pl-10"
            />
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resident Management</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">User management features coming soon...</p>
      </div>
    </div>
  )
}

export default UserManagement