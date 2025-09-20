import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Bell, Calendar, CreditCard, MessageSquare, Users, FileText, 
  Wrench, Home, ArrowRight, AlertCircle, CheckCircle, Clock 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    recentNews: [],
    upcomingEvents: [],
    pendingPayments: [],
    activeTickets: [],
    quickStats: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setDashboardData({
          recentNews: [
            {
              id: 1,
              title: 'Pool Maintenance Scheduled',
              excerpt: 'The community pool will be closed for maintenance next week.',
              created_at: '2024-01-15',
              is_featured: true
            },
            {
              id: 2,
              title: 'New Playground Equipment Installed',
              excerpt: 'Check out the new playground equipment in the central park area.',
              created_at: '2024-01-12',
              is_featured: false
            }
          ],
          upcomingEvents: [
            {
              id: 1,
              title: 'Community BBQ',
              date: '2024-02-15',
              time: '6:00 PM',
              location: 'Central Park'
            },
            {
              id: 2,
              title: 'Board Meeting',
              date: '2024-02-05',
              time: '7:00 PM',
              location: 'Clubhouse'
            }
          ],
          pendingPayments: [
            {
              id: 1,
              description: 'Monthly HOA Dues - February 2024',
              amount: 250.00,
              due_date: '2024-02-01',
              status: 'pending'
            }
          ],
          activeTickets: [
            {
              id: 1,
              subject: 'Broken streetlight on Maple Drive',
              status: 'in_progress',
              created_at: '2024-01-10'
            }
          ],
          quickStats: {
            totalPayments: 12,
            openTickets: 1,
            upcomingEvents: 2,
            unreadNews: 3
          }
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const quickActions = [
    {
      name: 'Pay Dues',
      href: '/payments',
      icon: CreditCard,
      description: 'Make a payment or view payment history',
      color: 'bg-green-500',
      notification: dashboardData.pendingPayments.length > 0 ? dashboardData.pendingPayments.length : null
    },
    {
      name: 'Submit Request',
      href: '/requests',
      icon: Wrench,
      description: 'Report maintenance issues or submit requests',
      color: 'bg-blue-500'
    },
    {
      name: 'Book Amenities',
      href: '/bookings',
      icon: Calendar,
      description: 'Reserve clubhouse, pool, or other facilities',
      color: 'bg-purple-500'
    },
    {
      name: 'Community Forum',
      href: '/forum',
      icon: MessageSquare,
      description: 'Connect with neighbors and join discussions',
      color: 'bg-indigo-500'
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      description: 'Access community documents and forms',
      color: 'bg-orange-500'
    },
    {
      name: 'Resident Directory',
      href: '/directory',
      icon: Users,
      description: 'Find and connect with your neighbors',
      color: 'bg-pink-500'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#358939] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={`Welcome back, ${user?.full_name || 'Resident'}!`}
        subtitle="Your personalized community dashboard with everything you need to manage your HOA account and stay connected."
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        height="min-h-[350px]"
      >
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{dashboardData.quickStats.totalPayments}</div>
              <div className="text-white/80 text-sm">Payments Made</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{dashboardData.quickStats.openTickets}</div>
              <div className="text-white/80 text-sm">Open Tickets</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{dashboardData.quickStats.upcomingEvents}</div>
              <div className="text-white/80 text-sm">Upcoming Events</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{dashboardData.quickStats.unreadNews}</div>
              <div className="text-white/80 text-sm">Unread News</div>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Quick Actions */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Everything you need for community living, just a click away.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className="card hover:shadow-xl transition-all duration-300 group relative"
                >
                  {action.notification && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {action.notification}
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#358939] transition-colors">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                      <div className="mt-3 flex items-center text-[#358939] text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Access Now <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent News */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-[#358939]" />
                  Recent News
                </h3>
                <Link to="/news" className="text-sm text-[#358939] hover:text-[#2d7230] font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData.recentNews.map((article) => (
                  <div key={article.id} className="border-l-4 border-[#358939]/30 pl-4 hover:border-[#358939] transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.title}
                      </h4>
                      {article.is_featured && (
                        <span className="text-xs bg-[#358939]/10 text-[#358939] px-2 py-1 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{article.excerpt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Events
                </h3>
                <Link to="/events" className="text-sm text-[#358939] hover:text-[#2d7230] font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p>🕒 {event.time} • 📍 {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Payments */}
            {dashboardData.pendingPayments.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Pending Payments
                  </h3>
                  <Link to="/payments" className="text-sm text-[#358939] hover:text-[#2d7230] font-medium">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {dashboardData.pendingPayments.map((payment) => (
                    <div key={payment.id} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.description}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Due: {new Date(payment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ${payment.amount.toFixed(2)}
                          </div>
                          <Link
                            to="/payments"
                            className="text-xs text-[#358939] hover:text-[#2d7230] font-medium"
                          >
                            Pay Now →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Tickets */}
            {dashboardData.activeTickets.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Wrench className="w-5 h-5 mr-2 text-orange-600" />
                    Active Tickets
                  </h3>
                  <Link to="/requests" className="text-sm text-[#358939] hover:text-[#2d7230] font-medium">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {dashboardData.activeTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(ticket.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created: {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            ticket.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                          }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard