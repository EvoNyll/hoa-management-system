import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const { effectiveTheme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showSidebar = isAuthenticated && user?.role !== 'guest'
  
  const showNavbar = !isAuthenticated || location.pathname === '/login' || location.pathname === '/register'

  const publicPages = ['/', '/about', '/board-members', '/community-map', '/news', '/events', '/contact-directory', '/documents', '/contact']
  const isPublicPage = publicPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Public Navbar */}
      {(showNavbar || isPublicPage) && (
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      )}

      {/* Sidebar for authenticated users */}
      {showSidebar && (
        <>
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main content */}
      <div className={`${showSidebar ? 'lg:pl-64' : ''}`}>
        {/* Top bar for authenticated pages (not public) */}
        {showSidebar && !isPublicPage && (
          <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6 transition-colors">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  Welcome back, {user?.full_name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className={`bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors ${showNavbar || isPublicPage ? 'pt-0' : ''}`}>
          {children}
        </main>

        {/* Footer for public pages */}
        {(showNavbar || isPublicPage) && <Footer />}
      </div>
    </div>
  )
}

export default Layout