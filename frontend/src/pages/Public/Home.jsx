import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { newsAPI } from '../../services/news'
import { eventsAPI } from '../../services/events'
import { PageSpinner, CardSkeleton } from '../../components/common/LoadingSpinner'
import { Calendar, Users, FileText, MessageSquare, ArrowRight, Star, Home } from 'lucide-react'

const HomePage = () => {
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
      {/* Hero Section with Image Background */}
      <section className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="relative rounded-3xl overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Green Overlay with 80% opacity */}
            <div className="absolute inset-0 bg-[#358939] bg-opacity-80"></div>
            
            {/* Additional gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <div className="w-full h-full bg-gradient-to-l from-white/10 to-transparent"></div>
            </div>
            
            <div className="relative w-full px-8 sm:px-12 lg:px-16 py-20 lg:py-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h1 className="heading-1 text-white">
                      Welcome to <span className="text-white font-bold">Greenfield HOA</span>
                    </h1>
                    <p className="text-large text-green-50 max-w-2xl">
                      Experience premium community living with modern amenities, 
                      beautiful landscapes, and a vibrant neighborhood atmosphere in Pleasant Valley.
                    </p>
                  </div>
                  
                  {!isAuthenticated ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/register"
                        className="btn btn-large bg-white text-[#7CB342] hover:bg-gray-100 shadow-xl hover:shadow-2xl"
                      >
                        Join Our Community
                      </Link>
                      <Link
                        to="/about"
                        className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#7CB342]"
                      >
                        Learn More
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="btn btn-large bg-white text-[#7CB342] hover:bg-gray-100 shadow-xl hover:shadow-2xl"
                    >
                      Go to Dashboard
                    </Link>
                  )}
                </div>
                
                {/* Hero Image/Illustration Area */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                          <Home className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Your Community Portal</h3>
                        <p className="text-green-100">Access all community services and amenities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold text-[#7CB342]">500+</div>
              <div className="text-gray-600 font-medium">Happy Residents</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold text-[#7CB342]">25</div>
              <div className="text-gray-600 font-medium">Acres of Beauty</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold text-[#7CB342]">10+</div>
              <div className="text-gray-600 font-medium">Premium Amenities</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold text-[#7CB342]">24/7</div>
              <div className="text-gray-600 font-medium">Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gray-900 mb-6">
              Community Services
            </h2>
            <p className="text-large text-gray-600 max-w-3xl mx-auto">
              Everything you need for comfortable community living, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/board-members"
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#7CB342] transition-colors">Board Members</h3>
              <p className="text-gray-600 leading-relaxed">Meet your community leaders and board representatives</p>
            </Link>

            <Link
              to="/documents"
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#7CB342] transition-colors">Documents</h3>
              <p className="text-gray-600 leading-relaxed">Access rules, regulations, and important forms</p>
            </Link>

            <Link
              to="/contact-directory"
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#7CB342] transition-colors">Contact Us</h3>
              <p className="text-gray-600 leading-relaxed">Get in touch with the HOA office and services</p>
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#7CB342] transition-colors">
                {isAuthenticated ? "Dashboard" : "Resident Portal"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isAuthenticated ? "Access your personal account and services" : "Login to access member services"}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gray-900 mb-6">
              Latest Community News
            </h2>
            <p className="text-large text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest announcements and happenings in our community.
            </p>
          </div>

          {error ? (
            <div className="alert alert-error max-w-md mx-auto">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="card">
                    <div className="skeleton h-48 mb-6"></div>
                    <div className="skeleton h-4 mb-4"></div>
                    <div className="skeleton h-3 mb-2"></div>
                    <div className="skeleton h-3 w-3/4"></div>
                  </div>
                ))
              ) : featuredNews.length > 0 ? (
                featuredNews.map((article) => (
                  <div key={article.id} className="card group hover:shadow-xl transition-all duration-300">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {article.excerpt || article.content}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        <Link
                          to={`/news/${article.id}`}
                          className="text-[#7CB342] hover:text-[#6BA93A] font-medium flex items-center gap-1"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Yet</h3>
                  <p className="text-gray-600">Check back soon for community updates and announcements.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/news"
              className="btn btn-primary"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <p className="text-large text-gray-600 max-w-3xl mx-auto">
              Join us for exciting community events and activities throughout the year.
            </p>
          </div>

          {error ? (
            <div className="alert alert-error max-w-md mx-auto">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="card group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="feature-icon-large">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors mb-2">
                          {event.title}
                        </h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                          <p>🕒 {event.time}</p>
                          {event.location && <p>📍 {event.location}</p>}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-[#7CB342] hover:text-[#6BA93A] font-medium flex items-center gap-1"
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
                  <p className="text-gray-600">Check back soon for upcoming community events and activities.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/events"
              className="btn btn-primary"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage