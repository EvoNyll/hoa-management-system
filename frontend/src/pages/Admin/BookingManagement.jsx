import React from 'react'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'

const BookingManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Booking Management</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Facility Reservations</h2>
            <p className="text-gray-600 dark:text-gray-400">Review and approve facility bookings</p>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">Booking management features coming soon...</p>
      </div>
    </div>
  )
}

export default BookingManagement