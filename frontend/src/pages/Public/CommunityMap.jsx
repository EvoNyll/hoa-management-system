// File: frontend/src/pages/Public/CommunityMap.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Navigation, Home, Car, Trees, Waves, Dumbbell, Users, 
  Phone, Shield, Clock, Building, Activity 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const CommunityMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [mapView, setMapView] = useState('overview') // overview, satellite, amenities

  const locations = [
    {
      id: 1,
      name: 'Main Clubhouse',
      category: 'amenities',
      icon: Users,
      coordinates: { x: 45, y: 30 },
      description: 'Community center with meeting rooms, event space, and administrative offices',
      hours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
      contact: '(555) 123-4567',
      amenities: ['Meeting Rooms', 'Event Hall', 'Kitchen Facilities', 'WiFi']
    },
    {
      id: 2,
      name: 'Swimming Pool Complex',
      category: 'amenities',
      icon: Waves,
      coordinates: { x: 60, y: 45 },
      description: 'Olympic-size swimming pool with kiddie pool, deck area, and poolside facilities',
      hours: 'Daily: 6AM-10PM',
      contact: '(555) 123-4568',
      amenities: ['Olympic Pool', 'Kids Pool', 'Pool Deck', 'Changing Rooms', 'Lifeguard on Duty']
    },
    {
      id: 3,
      name: 'Fitness Center',
      category: 'amenities',
      icon: Dumbbell,
      coordinates: { x: 35, y: 55 },
      description: 'Fully equipped gym with cardio equipment, weight training, and group exercise room',
      hours: '24/7 (Key Card Access)',
      contact: '(555) 123-4569',
      amenities: ['Cardio Equipment', 'Weight Training', 'Group Exercise Room', 'Locker Rooms']
    },
    {
      id: 4,
      name: 'Central Park',
      category: 'recreation',
      icon: Trees,
      coordinates: { x: 50, y: 65 },
      description: 'Beautiful green space with walking trails, playground, and picnic areas',
      hours: 'Dawn to Dusk',
      amenities: ['Walking Trails', 'Playground', 'Picnic Tables', 'Dog Park', 'Gazebo']
    },
    {
      id: 5,
      name: 'Main Gate & Security',
      category: 'security',
      icon: Shield,
      coordinates: { x: 20, y: 50 },
      description: '24/7 staffed security gate with visitor management and emergency response',
      hours: '24/7',
      contact: '(555) 123-4570',
      amenities: ['24/7 Security', 'Visitor Check-in', 'Emergency Response', 'Vehicle Gate']
    },
    {
      id: 6,
      name: 'Guest Parking',
      category: 'parking',
      icon: Car,
      coordinates: { x: 30, y: 40 },
      description: 'Designated parking area for visitors and guests',
      hours: '24/7',
      amenities: ['50 Parking Spaces', 'Well Lit', 'Security Patrol']
    },
    {
      id: 7,
      name: 'Emergency Contact Box',
      category: 'emergency',
      icon: Phone,
      coordinates: { x: 70, y: 35 },
      description: 'Emergency communication point with direct line to security and emergency services',
      hours: '24/7',
      contact: 'Emergency Only'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Locations', icon: MapPin, color: 'bg-gray-500' },
    { id: 'amenities', name: 'Amenities', icon: Users, color: 'bg-blue-500' },
    { id: 'recreation', name: 'Recreation', icon: Trees, color: 'bg-green-500' },
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-red-500' },
    { id: 'parking', name: 'Parking', icon: Car, color: 'bg-purple-500' },
    { id: 'emergency', name: 'Emergency', icon: Phone, color: 'bg-orange-500' }
  ]

  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(loc => loc.category === selectedCategory)

  const getCategoryColor = (category) => {
    const categoryData = categories.find(cat => cat.id === category)
    return categoryData ? categoryData.color : 'bg-gray-500'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Community Map & Amenities"
        subtitle="Explore our beautiful community layout, discover amenities, and find important locations throughout Greenfield HOA."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Community Map']}
        height="min-h-[400px]"
      >
        <div className="mt-8">
          <div className="flex flex-wrap gap-4">
            {['overview', 'satellite', 'amenities'].map((view) => (
              <button
                key={view}
                onClick={() => setMapView(view)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  mapView === view
                    ? 'bg-white text-[#358939] shadow-lg'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </button>
            ))}
          </div>
        </div>
      </HeroSection>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-[#358939] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Map Display */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden">
                <div className="bg-[#358939] text-white p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Community Layout - {mapView.charAt(0).toUpperCase() + mapView.slice(1)} View
                  </h3>
                  <div className="text-sm text-white/80">
                    Click on pins for details
                  </div>
                </div>
                
                {/* Map Container */}
                <div className="relative bg-gradient-to-br from-green-100 to-green-200 h-96 lg:h-[500px]">
                  {/* Community Boundary */}
                  <div className="absolute inset-4 border-2 border-dashed border-[#358939]/30 rounded-xl"></div>
                  
                  {/* Roads */}
                  <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-400 transform -translate-x-1/2"></div>
                  
                  {/* Location Pins */}
                  {filteredLocations.map((location) => {
                    const IconComponent = location.icon
                    return (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 ${getCategoryColor(location.category)} ${
                          selectedLocation?.id === location.id ? 'ring-4 ring-white ring-opacity-60 scale-110' : ''
                        }`}
                        style={{
                          left: `${location.coordinates.x}%`,
                          top: `${location.coordinates.y}%`
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    )
                  })}
                  
                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
                    <div className="space-y-1">
                      {categories.slice(1).map((category) => {
                        const IconComponent = category.icon
                        return (
                          <div key={category.id} className="flex items-center text-xs text-gray-700">
                            <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {category.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Compass */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-[#358939]" />
                    </div>
                    <div className="text-xs text-center text-gray-600 mt-1">N</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Details */}
            <div className="space-y-6">
              {selectedLocation ? (
                <div className="card">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getCategoryColor(selectedLocation.category)}`}>
                      <selectedLocation.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{selectedLocation.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white mt-1 ${getCategoryColor(selectedLocation.category)}`}>
                        {selectedLocation.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedLocation.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedLocation.hours}
                    </div>
                    
                    {selectedLocation.contact && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedLocation.contact}
                      </div>
                    )}
                    
                    {selectedLocation.amenities && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLocation.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-[#358939]/10 text-[#358939] text-xs rounded-lg">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card text-center">
                  <MapPin className="w-12 h-12 text-[#358939] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Location</h3>
                  <p className="text-gray-600">Click on any pin on the map to view detailed information about that location.</p>
                </div>
              )}
              
              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Area</span>
                    <span className="font-semibold">25 Acres</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Green Space</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amenities</span>
                    <span className="font-semibold">10+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Parking Spaces</span>
                    <span className="font-semibold">200+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amenities</h2>
            <p className="text-lg text-gray-600">Discover all the wonderful facilities available to our community members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.filter(loc => loc.category === 'amenities').map((amenity) => {
              const IconComponent = amenity.icon
              return (
                <div key={amenity.id} className="card group hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-[#358939] text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#358939] transition-colors">
                    {amenity.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{amenity.description}</p>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      {amenity.hours}
                    </div>
                    {amenity.contact && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {amenity.contact}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Directions and Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Visit Our Community
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Located in the heart of Pleasant Valley, our community offers easy access to shopping, dining, and entertainment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Address</h3>
                <p className="text-white/90">
                  123 Greenfield Drive<br />
                  Pleasant Valley, CA 12345
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Main Office</h3>
                <p className="text-white/90">
                  Phone: (555) 123-4567<br />
                  Email: info@greenfieldHOA.com
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                Get Directions
              </button>
              <Link
                to="/contact"
                className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#358939]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CommunityMap