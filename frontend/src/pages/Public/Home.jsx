import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { newsAPI } from '../../services/news'
import { eventsAPI } from '../../services/events'
import { PageSpinner, CardSkeleton } from '../../components/common/LoadingSpinner'
import { Calendar, Users, FileText, MessageSquare, ArrowRight, Star } from 'lucide-react'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [featuredNews, setFeaturedNews] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Load featured news
      const newsResponse = await newsAPI.getNews({ 
        is_featured: true, 
        is_public: true,
        page_size: 3 
      })
      setFeaturedNews(newsResponse.results || [])

      // Load upcoming events
      const eventsResponse = await eventsAPI.getEvents({ 
        is_public: true,
        page_size: 3 
      })
      setUpcomingEvents(eventsResponse.results || [])

    } catch (err) {
      console.error('Failed to load home data:', err)
      setError('Failed to load content. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading community information..." />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#39423B] via-[#39423B] to-[#2d332f] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-white">Greenfield HOA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl leading-relaxed">
              Your premier residential community offering modern amenities, 
              beautiful landscapes, and a strong sense of community in the heart of Pleasant Valley.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#39423B] bg-white hover:bg-gray-100 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Join Our Community
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-[#39423B] rounded-lg transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#39423B] bg-white hover:bg-gray-100 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
        <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#39423B]">500+</div>
              <div className="text-gray-600">Happy Residents</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#39423B]">25</div>
              <div className="text-gray-600">Acres of Beauty</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#39423B]">10+</div>
              <div className="text-gray-600">Amenities</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#39423B]">24/7</div>
              <div className="text-gray-600">Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Community News
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest announcements and happenings in our community.
            </p>
          </div>

          {error ? (
            <div className="alert alert-error max-w-md mx-auto">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))
              ) : featuredNews.length > 0 ? (
                featuredNews.map((article) => (
                  <div key={article.id} className="card hover:shadow-md transition-shadow">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt || article.content.substring(0, 120) + '...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/news`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                      >
                        Read More <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No featured news available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/news"
              className="btn btn-outline"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us for exciting community events and activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-600">
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {event.description.substring(0, 120) + '...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      📍 {event.location}
                    </span>
                    <Link
                      to="/events"
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                    >
                      Learn More <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events scheduled.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="btn btn-outline"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Access
            </h2>
            <p className="text-gray-600">
              Find what you need quickly and easily.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/board-members"
              className="card text-center hover:shadow-md transition-shadow group"
            >
              <Users className="w-8 h-8 text-[#39423B] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Board Members</h3>
              <p className="text-sm text-gray-600">Meet your community leaders</p>
            </Link>

            <Link
              to="/documents"
              className="card text-center hover:shadow-md transition-shadow group"
            >
              <FileText className="w-8 h-8 text-[#39423B] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
              <p className="text-sm text-gray-600">Rules, regulations & forms</p>
            </Link>

            <Link
              to="/contact-directory"
              className="card text-center hover:shadow-md transition-shadow group"
            >
              <MessageSquare className="w-8 h-8 text-[#39423B] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">Get in touch with the HOA</p>
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="card text-center hover:shadow-md transition-shadow group"
            >
              <Users className="w-8 h-8 text-[#39423B] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {isAuthenticated ? "Dashboard" : "Resident Portal"}
              </h3>
              <p className="text-sm text-gray-600">
                {isAuthenticated ? "Access your account" : "Login to your account"}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home