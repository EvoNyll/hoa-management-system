import React from 'react'
import { Phone, Mail, Clock, AlertTriangle } from 'lucide-react'

const ContactDirectory = () => {
  const contacts = [
    {
      name: 'HOA Office',
      title: 'General Information',
      phone: '(555) 123-4567',
      email: 'info@greenfieldHOA.com',
      isEmergency: false
    },
    {
      name: 'Emergency Line',
      title: '24/7 Emergency Response',
      phone: '(555) 123-4568',
      email: 'emergency@greenfieldHOA.com',
      isEmergency: true
    },
    {
      name: 'Maintenance',
      title: 'Maintenance Requests',
      phone: '(555) 123-4569',
      email: 'maintenance@greenfieldHOA.com',
      isEmergency: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Directory</h1>
            <p className="text-gray-600">Get in touch with HOA services and support</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <div key={index} className={`card ${contact.isEmergency ? 'border-red-200 bg-red-50' : ''}`}>
              {contact.isEmergency && (
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-600 font-medium text-sm">EMERGENCY</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{contact.name}</h3>
              <p className="text-gray-600 mb-4">{contact.title}</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <a href={`tel:${contact.phone}`} className="text-green-600 hover:text-green-700">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <a href={`mailto:${contact.email}`} className="text-green-600 hover:text-green-700">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card">
          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
              <div className="text-gray-600">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="mt-2 text-sm text-red-600">Emergency line available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDirectory