import React from 'react'
import { User, Settings, Bell } from 'lucide-react'

const Account = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Account management features coming soon...</p>
      </div>
    </div>
  )
}

export default Account