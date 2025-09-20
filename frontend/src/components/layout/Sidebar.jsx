import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, 
  User, 
  CreditCard, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Shield,
  Wrench,
  Vote,
  DollarSign,
  ClipboardList,
  Building
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasRole } = useAuth()
  const location = useLocation()

  const memberNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Account', href: '/account', icon: User },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Payment History', href: '/payment-history', icon: DollarSign },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Requests', href: '/requests', icon: Wrench },
    { name: 'Forum', href: '/forum', icon: MessageSquare },
    { name: 'Directory', href: '/directory', icon: Users },
    { name: 'Polls', href: '/polls', icon: Vote },
  ]

  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'News & Events', href: '/admin/news', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Bookings', href: '/admin/bookings', icon: Building },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Tickets', href: '/admin/tickets', icon: ClipboardList },
    { name: 'Forum', href: '/admin/forum', icon: MessageSquare },
    { name: 'Polls', href: '/admin/polls', icon: Vote },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    onClose?.()
  }

  return (
    <>
      <div 
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-mobile'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Greenfield HOA</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role} {user?.unit_number && `• Unit ${user.unit_number}`}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-thin">
            {/* Member Navigation */}
            <div className="space-y-1">
              {memberNavItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => onClose?.()}
                    className={`nav-link ${
                      isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Admin Navigation */}
            {hasRole('admin') && (
              <div className="pt-4">
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
                <div className="space-y-1">
                  {adminNavItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => onClose?.()}
                        className={`nav-link ${
                          isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Bottom actions */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              to="/account"
              onClick={() => onClose?.()}
              className="nav-link nav-link-inactive"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link nav-link-inactive w-full text-left"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar