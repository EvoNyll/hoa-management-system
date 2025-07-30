import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Determine if we should show the sidebar
  const showSidebar = isAuthenticated && user?.role !== 'guest'
  
  // Determine if we should show the navbar
  const showNavbar = !isAuthenticated || location.pathname === '/login' || location.pathname === '/register'

  // Public pages that should show navbar even when authenticated
  const publicPages = ['/', '/about', '/board-members', '/community-map', '/news', '/events', '/contact-directory', '/documents', '/contact']
  const isPublicPage = publicPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Welcome back, {user?.full_name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className={`${showNavbar || isPublicPage ? 'pt-0' : ''}`}>
          {children}
        </main>

        {/* Footer for public pages */}
        {(showNavbar || isPublicPage) && <Footer />}
      </div>
    </div>
  )
}

export default Layout