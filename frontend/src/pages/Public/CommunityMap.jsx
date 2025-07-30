import React from 'react'
import { MapPin, Navigation, Home } from 'lucide-react'

const CommunityMap = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Map</h1>
            <p className="text-gray-600">Explore our neighborhood layout and amenities</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-8">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Community Map</h3>
            <p className="text-gray-600">Detailed map with amenities and unit locations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <Home className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Residential Areas</h3>
            <p className="text-gray-600 text-sm">Units 1-200 organized in quiet neighborhoods</p>
          </div>
          <div className="card">
            <Navigation className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
            <p className="text-gray-600 text-sm">Pool, gym, community center, and more</p>
          </div>
          <div className="card">
            <MapPin className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Key Locations</h3>
            <p className="text-gray-600 text-sm">Office, mailroom, visitor parking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityMap