import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, Filter, Search, Star, ArrowRight } from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const categories = [
    { id: 'all', name: 'All Events', count: 8 },
    { id: 'social', name: 'Social', count: 3 },
    { id: 'meetings', name: 'Meetings', count: 2 },
    { id: 'maintenance', name: 'Maintenance', count: 1 },
    { id: 'recreational', name: 'Recreational', count: 2 }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Community BBQ & Pool Party',
      description: 'Join us for our annual summer BBQ event with live music, games for kids, and delicious food for the whole family.',
      date: '2024-02-15',
      time: '6:00 PM - 9:00 PM',
      location: 'Central Park & Pool Area',
      category: 'social',
      attendees: 45,
      maxAttendees: 80,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      rsvpRequired: true
    },
    {
      id: 2,
      title: 'Monthly Board Meeting',
      description: 'Regular monthly board meeting to discuss community matters, budget updates, and upcoming projects.',
      date: '2024-02-05',
      time: '7:00 PM - 8:30 PM',
      location: 'Clubhouse Conference Room',
      category: 'meetings',
      attendees: 12,
      maxAttendees: 25,
      featured: false,
      rsvpRequired: false
    },
    {
      id: 3,
      title: 'Fitness Class: Yoga in the Park',
      description: 'Free outdoor yoga session for all skill levels. Bring your own mat and enjoy a peaceful morning workout.',
      date: '2024-02-10',
      time: '8:00 AM - 9:00 AM',
      location: 'Central Park Gazebo',
      category: 'recreational',
      attendees: 18,
      maxAttendees: 20,
      featured: false,
      rsvpRequired: true
    },
    {
      id: 4,
      title: 'Garden Club Meeting',
      description: 'Monthly meeting of the community garden club. Discuss spring planting and share gardening tips.',
      date: '2024-02-20',
      time: '2:00 PM - 3:30 PM',
      location: 'Community Garden',
      category: 'social',
      attendees: 8,
      maxAttendees: 15,
      featured: false,
      rsvpRequired: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(upcomingEvents)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    const colors = {
      social: 'bg-purple-100 text-purple-800',
      meetings: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      recreational: 'bg-green-100 text-green-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Community Events"
        subtitle="Join your neighbors and participate in exciting community activities, meetings, and social gatherings throughout the year."
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Events']}
        height="min-h-[400px]"
      >
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
              Search
            </button>
          </div>
        </div>
      </HeroSection>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#358939] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => {
                    const dateInfo = formatDate(event.date)
                    return (
                      <article key={event.id} className="card group hover:shadow-xl transition-all duration-300">
                        <div className="relative mb-6 overflow-hidden rounded-2xl">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-48 bg-[#358939]/10 flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-[#358939]" />
                            </div>
                          )}
                          
                          {/* Date Badge */}
                          <div className="absolute top-4 left-4 bg-white rounded-xl p-3 shadow-lg text-center">
                            <div className="text-[#358939] font-bold text-lg">{dateInfo.day}</div>
                            <div className="text-gray-600 text-sm font-medium">{dateInfo.month}</div>
                          </div>
                          
                          {event.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="inline-flex items-center px-3 py-1 bg-[#358939] text-white text-sm font-medium rounded-full">
                                <Star className="w-4 h-4 mr-1" />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                            {event.rsvpRequired && (
                              <span className="text-xs text-[#358939] font-medium">RSVP Required</span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#358939] transition-colors">
                            {event.title}
                          </h3>
                          
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            {event.maxAttendees && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                {event.attendees}/{event.maxAttendees} attending
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-sm font-medium text-gray-900">
                              {dateInfo.fullDate}
                            </div>
                            <button
                              onClick={() => setSelectedEvent(event)}
                              className="text-[#358939] hover:text-[#2d7230] font-medium flex items-center gap-1 text-sm group-hover:translate-x-1 transition-all"
                            >
                              View Details <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Check back soon for upcoming community events.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Calendar Integration CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Never Miss an Event
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Stay updated with all community events and activities. Add our events to your personal calendar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                Subscribe to Calendar
              </button>
              <Link
                to="/login"
                className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#358939]"
              >
                RSVP to Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.featured && (
                      <span className="inline-flex items-center px-3 py-1 bg-[#358939] text-white text-sm font-medium rounded-full">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedEvent.image && (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                  />
                )}

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedEvent.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(selectedEvent.date).fullDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedEvent.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedEvent.location}
                  </div>
                  {selectedEvent.maxAttendees && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {selectedEvent.attendees}/{selectedEvent.maxAttendees} attending
                    </div>
                  )}
                </div>

                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex gap-4">
                  {selectedEvent.rsvpRequired ? (
                    <Link
                      to="/login"
                      className="btn btn-primary btn-large flex-1"
                    >
                      RSVP Now
                    </Link>
                  ) : (
                    <button className="btn btn-primary btn-large flex-1">
                      Add to Calendar
                    </button>
                  )}
                  <button className="btn btn-outline btn-large">
                    Share Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events