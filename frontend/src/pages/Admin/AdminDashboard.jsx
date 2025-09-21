import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Users, FileText, Calendar, CreditCard, Wrench, MessageSquare, 
  BarChart3, TrendingUp, DollarSign, Clock, Shield, Settings,
  ArrowRight, AlertTriangle, CheckCircle 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [adminData, setAdminData] = useState({
    stats: {},
    recentActivity: [],
    pendingItems: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setAdminData({
          stats: {
            totalResidents: 487,
            pendingPayments: 23,
            openTickets: 7,
            upcomingEvents: 3,
            totalRevenue: 125600,
            occupancyRate: 94
          },
          recentActivity: [
            {
              id: 1,
              type: 'user_registration',
              description: 'New resident registered: Sarah Wilson',
              timestamp: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              type: 'payment_received',
              description: 'Payment received from Unit 245 - $275.00',
              timestamp: '2024-01-15T09:15:00Z'
            },
            {
              id: 3,
              type: 'ticket_created',
              description: 'New maintenance ticket: Pool filter issue',
              timestamp: '2024-01-14T16:45:00Z'
            }
          ],
          pendingItems: [
            { type: 'tickets', count: 7, urgent: 2 },
            { type: 'approvals', count: 4, urgent: 1 },
            { type: 'payments', count: 23, urgent: 5 }
          ]
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load admin data:', error)
      setLoading(false)
    }
  }

  const quickActions = [
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage residents and user accounts',
      color: 'bg-blue-500',
      count: adminData.stats.totalResidents
    },
    {
      name: 'News & Events',
      href: '/admin/news-events',
      icon: FileText,
      description: 'Create and manage community content',
      color: 'bg-green-500',
      count: adminData.stats.upcomingEvents
    },
    {
      name: 'Facility Bookings',
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
      color: 'bg-emerald-500',
      count: adminData.stats.pendingPayments,
      urgent: true
    },
    {
      name: 'Manage Tickets',
      href: '/admin/tickets',
      icon: Wrench,
      description: 'Handle maintenance requests and issues',
      color: 'bg-orange-500',
      count: adminData.stats.openTickets,
      urgent: adminData.stats.openTickets > 5
    },
    {
      name: 'Forum Moderation',
      href: '/admin/forum',
      icon: MessageSquare,
      description: 'Moderate community discussions',
      color: 'bg-indigo-500'
    }
  ]

  const statsCards = [
    {
      title: 'Total Residents',
      value: adminData.stats.totalResidents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2.5%',
      changeType: 'increase'
    },
    {
      title: 'Monthly Revenue',
      value: `${adminData.stats.totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Open Tickets',
      value: adminData.stats.openTickets,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-12%',
      changeType: 'decrease'
    },
    {
      title: 'Occupancy Rate',
      value: `${adminData.stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+1.1%',
      changeType: 'increase'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'ticket_created':
        return <Wrench className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#358939] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={`Admin Dashboard 🛡️`}
        subtitle={`Welcome back, ${user?.full_name}. Here's your community management overview and administrative tools.`}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        height="min-h-[350px]"
      >
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsCards.slice(0, 4).map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.title}</div>
                <div className={`text-xs mt-1 ${stat.changeType === 'increase' ? 'text-green-200' : 'text-red-200'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </HeroSection>

      {/* Quick Actions */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Management Tools</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Administrative functions to manage your community efficiently.</p>
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
                  {action.count && (
                    <div className={`absolute -top-2 -right-2 w-8 h-8 ${action.urgent ? 'bg-red-500' : 'bg-[#358939]'} text-white text-xs rounded-full flex items-center justify-center font-bold`}>
                      {action.count}
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
                        Manage <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Analytics & Activity */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Recent Activity
                </h3>
                <Link to="#" className="text-sm text-[#358939] hover:text-[#2d7230] font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {adminData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                  Pending Items
                </h3>
              </div>
              <div className="space-y-4">
                {adminData.pendingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {item.type}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.urgent > 0 && `${item.urgent} urgent`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</div>
                      {item.urgent > 0 && (
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {item.urgent} urgent
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  System Health
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database Size</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2.3 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
                  <span className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Healthy
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Reports */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                  Generate Reports
                </h3>
              </div>
              <div className="space-y-3">
                <button className="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#358939] hover:bg-[#358939]/5 dark:hover:bg-[#358939]/10 transition-colors group">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-[#358939]">Financial Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly payment summary and revenue analysis</p>
                </button>
                <button className="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#358939] hover:bg-[#358939]/5 dark:hover:bg-[#358939]/10 transition-colors group">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-[#358939]">Maintenance Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket status overview and maintenance trends</p>
                </button>
                <button className="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:border-[#358939] hover:bg-[#358939]/5 dark:hover:bg-[#358939]/10 transition-colors group">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-[#358939]">Occupancy Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Resident activity and occupancy analytics</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard