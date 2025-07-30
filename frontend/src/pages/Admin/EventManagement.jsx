import React from 'react'
import { Calendar, Plus } from 'lucide-react'

const EventManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Calendar className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Event Planning</h2>
            <p className="text-gray-600">Organize community events and activities</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Event management features coming soon...</p>
      </div>
    </div>
  )
}

export default EventManagement