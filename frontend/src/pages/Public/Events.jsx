import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { PageSpinner } from '../../components/common/LoadingSpinner'

const Events = () => {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setEvents([
        {
          id: 1,
          title: 'Community BBQ',
          description: 'Join us for our annual summer BBQ with live music and activities for all ages.',
          start_date: '2024-08-15T18:00:00Z',
          location: 'Community Center',
          is_public: true
        },
        {
          id: 2,
          title: 'Board Meeting',
          description: 'Monthly board meeting open to all residents.',
          start_date: '2024-08-20T19:00:00Z',
          location: 'Clubhouse',
          is_public: true
        }
      ])
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading events..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Events</h1>
            <p className="text-gray-600">Join us for upcoming community activities</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(event.start_date).toLocaleDateString()} at{' '}
                      {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events