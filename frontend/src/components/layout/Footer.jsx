import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Board Members', href: '/board-members' },
    { name: 'Community Map', href: '/community-map' },
    { name: 'Contact Directory', href: '/contact-directory' },
  ]

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Community Events', href: '/events' },
    { name: 'Documents & Forms', href: '/documents' },
    { name: 'Resident Portal', href: '/login' },
  ]

  return (
    <footer className="bg-gradient-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Home className="w-7 h-7 text-[#7CB342]" />
              </div>
              <span className="text-2xl font-bold">Greenfield HOA</span>
            </div>
            <p className="text-green-100 leading-relaxed">
              A premier residential community dedicated to providing exceptional living experiences 
              for our residents through quality amenities and professional management.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-green-100 hover:text-white hover:bg-white/20 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-green-100 hover:text-white hover:bg-white/20 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-green-100 hover:text-white hover:bg-white/20 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-green-100 hover:text-white transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.href}
                    className="text-green-100 hover:text-white transition-colors font-medium"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>123 Greenfield Drive</p>
                  <p>Pleasant Valley, CA 94588</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a 
                  href="tel:+15551234567" 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  (555) 123-4567
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a 
                  href="mailto:info@greenfieldHOA.com" 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  info@greenfieldHOA.com
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Office Hours</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} Greenfield HOA. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer