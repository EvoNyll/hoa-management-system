import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAlert } from '../../context/AlertContext'
import { PageSpinner, CardSkeleton } from '../../components/common/LoadingSpinner'
import { 
  CreditCard, 
  Calendar, 
  Wrench, 
  MessageSquare, 
  Bell, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { showSuccess } = useAlert()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    recentNews: [],
    upcomingEvents: [],
    pendingPayments: [],
    recentTickets: [],
    quickStats: {}
  })

  useEffect(() => {
    loadDashboardData()
    showSuccess(`Welcome back, ${user?.full_name}!`)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock dashboard data
      setDashboardData({
        recentNews: [
          {
            id: 1,
            title: "Pool Maintenance Schedule Updated",
            excerpt: "The community pool will undergo maintenance from June 15-17...",
            created_at: "2024-06-10T10:00:00Z",
            is_featured: true
          },
          {
            id: 2,
            title: "New Parking Regulations",
            excerpt: "Please note the updated parking guidelines effective July 1st...",
            created_at: "2024-06-08T14:30:00Z",
            is_featured: false
          }
        ],
        upcomingEvents: [
          {
            id: 1,
            title: "Community BBQ",
            start_date: "2024-07-15T18:00:00Z",
            location: "Community Center",
            requires_rsvp: true
          },
          {
            id: 2,
            title: "Board Meeting",
            start_date: "2024-07-20T19:00:00Z",
            location: "Clubhouse",
            requires_rsvp: false
          }
        ],
        pendingPayments: [
          {
            id: 1,
            payment_type: { name: "Monthly HOA Dues" },
            amount: "250.00",
            due_date: "2024-07-01"
          }
        ],
        recentTickets: [
          {
            id: 1,
            title: "Broken streetlight on Oak Street",
            status: "in_progress",
            priority: "medium",
            created_at: "2024-06-05T09:00:00Z"
          }
        ],
        quickStats: {
          totalPayments: 3000,
          activeTickets: 2,
          upcomingEvents: 3,
          forumPosts: 15
        }
      })

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading your dashboard..." />
  }

  const quickActions = [
    {
      name: 'Make Payment',
      href: '/payments',
      icon: CreditCard,
      description: 'Pay HOA dues and fees',
      color: 'bg-green-500'
    },
    {
      name: 'Book Facility',
      href: '/bookings',
      icon: Calendar,
      description: 'Reserve community amenities',
      color: 'bg-blue-500'
    },
    {
      name: 'Submit Request',
      href: '/requests',
      icon: Wrench,
      description: 'Report maintenance issues',
      color: 'bg-orange-500'
    },
    {
      name: 'Community Forum',
      href: '/forum',
      icon: MessageSquare,
      description: 'Connect with neighbors',
      color: 'bg-purple-500'
    }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      high: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your community today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Paid This Year
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  ${dashboardData.quickStats.totalPayments}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Tickets
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {dashboardData.quickStats.activeTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Upcoming Events
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {dashboardData.quickStats.upcomingEvents}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Forum Activity
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {dashboardData.quickStats.forumPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent News */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-green-600" />
              Recent News
            </h3>
            <Link to="/news" className="text-sm text-green-600 hover:text-green-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recentNews.map((article) => (
              <div key={article.id} className="border-l-4 border-green-200 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {article.title}
                  </h4>
                  {article.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Events
            </h3>
            <Link to="/events" className="text-sm text-green-600 hover:text-green-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.upcomingEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-200 pl-4">
                <h4 className="text-sm font-medium text-gray-900">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600">📍 {event.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleDateString()} at{' '}
                    {new Date(event.start_date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  {event.requires_rsvp && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      RSVP Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Pending Payments
            </h3>
            <Link to="/payments" className="text-sm text-green-600 hover:text-green-700">
              Pay now
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.pendingPayments.length > 0 ? (
              dashboardData.pendingPayments.map((payment) => (
                <div key={payment.id} className="border-l-4 border-yellow-200 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {payment.payment_type.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-green-600">
                      ${payment.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(payment.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">All payments up to date!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-orange-600" />
              Recent Tickets
            </h3>
            <Link to="/requests" className="text-sm text-green-600 hover:text-green-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recentTickets.length > 0 ? (
              dashboardData.recentTickets.map((ticket) => (
                <div key={ticket.id} className="border-l-4 border-orange-200 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {ticket.title}
                    </h4>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority} priority
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No active tickets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard