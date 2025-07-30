import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/common/LoadingSpinner'
import { 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Wrench, 
  MessageSquare,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState({
    stats: {},
    recentActivity: [],
    pendingItems: []
  })

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock admin data
      setAdminData({
        stats: {
          totalUsers: 156,
          activeTickets: 23,
          pendingBookings: 8,
          monthlyRevenue: 45600,
          newUsersThisMonth: 12,
          resolvedTicketsThisWeek: 15
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            message: 'New user registered: John Smith',
            timestamp: '2024-07-30T10:30:00Z'
          },
          {
            id: 2,
            type: 'payment_received',
            message: 'Payment received from Jane Doe - $250',
            timestamp: '2024-07-30T09:15:00Z'
          },
          {
            id: 3,
            type: 'ticket_created',
            message: 'New maintenance ticket: Pool filter issue',
            timestamp: '2024-07-30T08:45:00Z'
          }
        ],
        pendingItems: [
          {
            id: 1,
            type: 'booking',
            title: 'Clubhouse booking approval needed',
            count: 3
          },
          {
            id: 2,
            type: 'ticket',
            title: 'High priority tickets',
            count: 2
          },
          {
            id: 3,
            type: 'payment',
            title: 'Failed payments to review',
            count: 1
          }
        ]
      })

    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading admin dashboard..." />
  }

  const quickActions = [
    {
      name: 'Manage Users',
      href: '/admin/users',
      icon: Users,
      description: 'Add, edit, and manage resident accounts',
      color: 'bg-blue-500'
    },
    {
      name: 'News & Events',
      href: '/admin/news',
      icon: FileText,
      description: 'Create and manage community content',
      color: 'bg-green-500'
    },
    {
      name: 'View Bookings',
      href: '/admin/bookings',
      icon: Calendar,
      description: 'Review and approve facility bookings',
      color: 'bg-purple-500'
    },
    {
      name: 'Payment Reports',
      href: '/admin/payments',
      icon: CreditCard,
      description: 'Track payments and financial reports',
      color: 'bg-emerald-500'
    },
    {
      name: 'Manage Tickets',
      href: '/admin/tickets',
      icon: Wrench,
      description: 'Handle maintenance requests and issues',
      color: 'bg-orange-500'
    },
    {
      name: 'Forum Moderation',
      href: '/admin/forum',
      icon: MessageSquare,
      description: 'Moderate community discussions',
      color: 'bg-indigo-500'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'ticket_created':
        return <Wrench className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.full_name}. Here's your community overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {adminData.stats.totalUsers}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{adminData.stats.newUsersThisMonth}
                  </div>
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
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {adminData.stats.activeTickets}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {adminData.stats.resolvedTicketsThisWeek} resolved
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Bookings
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {adminData.stats.pendingBookings}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Monthly Revenue
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  ${adminData.stats.monthlyRevenue.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items Alert */}
      {adminData.pendingItems.length > 0 && (
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">
                Items Requiring Attention
              </h3>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              {adminData.pendingItems.map((item) => (
                <div key={item.id} className="bg-white rounded-md p-3 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{item.title}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <Link to="#" className="text-sm text-green-600 hover:text-green-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {adminData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              System Health
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">Payment System</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">Email Notifications</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-900">Backup System</span>
              </div>
              <span className="text-xs text-yellow-600 font-medium">Scheduled</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Size</span>
                <span className="text-sm font-medium text-gray-900">2.3 GB</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-sm font-medium text-gray-900">42</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm font-medium text-gray-900">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Generate Reports</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <h4 className="font-medium text-gray-900">Financial Report</h4>
              <p className="text-sm text-gray-600 mt-1">Monthly payment summary</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <h4 className="font-medium text-gray-900">Maintenance Report</h4>
              <p className="text-sm text-gray-600 mt-1">Ticket status overview</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <h4 className="font-medium text-gray-900">Occupancy Report</h4>
              <p className="text-sm text-gray-600 mt-1">Resident activity summary</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard