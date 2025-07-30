// File: frontend/src/pages/Public/ContactDirectory.jsx
import React, { useState } from 'react'
import { 
  Phone, Mail, MapPin, Clock, Shield, Wrench, Users, 
  AlertTriangle, Heart, Car, Zap, Droplets, Building 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const ContactDirectory = () => {
  const [selectedCategory, setSelectedCategory] = useState('emergency')

  const emergencyContacts = [
    {
      id: 1,
      name: 'Police Emergency',
      number: '911',
      description: 'For immediate police response',
      available: '24/7',
      category: 'emergency',
      priority: 'critical'
    },
    {
      id: 2,
      name: 'Fire Department',
      number: '911',
      description: 'Fire emergencies and medical emergencies',
      available: '24/7',
      category: 'emergency',
      priority: 'critical'
    },
    {
      id: 3,
      name: 'Community Security',
      number: '(555) 911-SAFE',
      description: '24/7 security patrol and emergency response',
      available: '24/7',
      category: 'emergency',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Maintenance Emergency',
      number: '(555) 911-FIXIT',
      description: 'After-hours maintenance emergencies only',
      available: '24/7',
      category: 'emergency',
      priority: 'high'
    }
  ]

  const hoaContacts = [
    {
      id: 5,
      name: 'HOA Main Office',
      number: '(555) 123-4567',
      email: 'info@greenfieldHOA.com',
      description: 'General inquiries and information',
      available: 'Mon-Fri: 9AM-6PM, Sat: 10AM-2PM',
      category: 'hoa'
    },
    {
      id: 6,
      name: 'Property Management',
      number: '(555) 123-4568',
      email: 'management@greenfieldHOA.com',
      description: 'Property issues, maintenance requests',
      available: 'Mon-Fri: 8AM-5PM',
      category: 'hoa'
    },
    {
      id: 7,
      name: 'Billing Department',
      number: '(555) 123-4569',
      email: 'billing@greenfieldHOA.com',
      description: 'HOA dues, payment questions',
      available: 'Mon-Fri: 9AM-5PM',
      category: 'hoa'
    },
    {
      id: 8,
      name: 'Board of Directors',
      email: 'board@greenfieldHOA.com',
      description: 'Board meetings, governance issues',
      available: 'Email responses within 48 hours',
      category: 'hoa'
    }
  ]

  const utilityContacts = [
    {
      id: 9,
      name: 'Pacific Gas & Electric',
      number: '1-800-PGE-5000',
      emergency: '1-800-PGE-5002',
      description: 'Gas and electric service',
      category: 'utilities',
      icon: Zap
    },
    {
      id: 10,
      name: 'Pleasant Valley Water District',
      number: '(555) 234-5678',
      emergency: '(555) 234-HELP',
      description: 'Water and sewer services',
      category: 'utilities',
      icon: Droplets
    },
    {
      id: 11,
      name: 'Waste Management',
      number: '(555) 345-6789',
      description: 'Trash and recycling pickup',
      available: 'Mon-Fri: 7AM-5PM',
      category: 'utilities',
      icon: Building
    },
    {
      id: 12,
      name: 'Comcast Cable/Internet',
      number: '1-800-COMCAST',
      description: 'Cable TV and internet services',
      available: '24/7 Customer Service',
      category: 'utilities',
      icon: Building
    }
  ]

  const localServices = [
    {
      id: 13,
      name: 'Pleasant Valley Medical Center',
      number: '(555) 456-7890',
      address: '456 Health Drive, Pleasant Valley',
      description: 'Full-service hospital and emergency room',
      available: '24/7 Emergency Room',
      category: 'medical',
      icon: Heart
    },
    {
      id: 14,
      name: 'Pleasant Valley Police (Non-Emergency)',
      number: '(555) 567-8901',
      description: 'Non-emergency police matters',
      available: '24/7',
      category: 'safety',
      icon: Shield
    },
    {
      id: 15,
      name: 'City Hall',
      number: '(555) 678-9012',
      address: '789 Government Ave, Pleasant Valley',
      description: 'City services and permits',
      available: 'Mon-Fri: 8AM-5PM',
      category: 'government',
      icon: Building
    }
  ]

  const categories = [
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'bg-red-500' },
    { id: 'hoa', name: 'HOA Services', icon: Users, color: 'bg-[#358939]' },
    { id: 'utilities', name: 'Utilities', icon: Zap, color: 'bg-blue-500' },
    { id: 'medical', name: 'Medical', icon: Heart, color: 'bg-pink-500' },
    { id: 'safety', name: 'Safety', icon: Shield, color: 'bg-orange-500' },
    { id: 'government', name: 'Government', icon: Building, color: 'bg-purple-500' }
  ]

  const getAllContacts = () => {
    return [...emergencyContacts, ...hoaContacts, ...utilityContacts, ...localServices]
  }

  const getFilteredContacts = () => {
    const allContacts = getAllContacts()
    return selectedCategory === 'all' 
      ? allContacts 
      : allContacts.filter(contact => contact.category === selectedCategory)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      default: return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Emergency & Contact Directory"
        subtitle="Quick access to important phone numbers, emergency contacts, and community services. Keep this information handy for peace of mind."
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Contact Directory']}
        height="min-h-[400px]"
      />

      {/* Emergency Alert Banner */}
      <section className="py-6 bg-red-600 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <AlertTriangle className="w-6 h-6" />
            <div className="text-center">
              <p className="font-bold text-lg">EMERGENCY: Dial 911</p>
              <p className="text-red-100">For life-threatening emergencies, always call 911 first</p>
            </div>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 border-2 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white border-transparent shadow-lg`
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                  }`} />
                  <div className={`font-medium text-sm ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contacts - Always Visible */}
      {selectedCategory === 'emergency' && (
        <section className="py-8 bg-red-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-red-800 mb-2">Emergency Contacts</h2>
              <p className="text-red-700">For immediate emergency response</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className={`card border-2 ${getPriorityColor(contact.priority)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${contact.priority === 'critical' ? 'bg-red-500' : 'bg-orange-500'} text-white rounded-xl flex items-center justify-center mr-4`}>
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                        {contact.priority === 'critical' && (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            CRITICAL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{contact.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Emergency Number:</span>
                      <a
                        href={`tel:${contact.number}`}
                        className="text-xl font-bold text-red-600 hover:text-red-700"
                      >
                        {contact.number}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{contact.available}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Contact Directory */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'emergency' ? 'Emergency Services' : 
               categories.find(cat => cat.id === selectedCategory)?.name || 'All Contacts'}
            </h2>
            <p className="text-lg text-gray-600">
              {selectedCategory === 'emergency' ? 'Critical emergency contact information' :
               'Important contact information for community services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredContacts().map((contact) => {
              const IconComponent = contact.icon || Phone
              return (
                <div key={contact.id} className="card hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                      contact.category === 'emergency' 
                        ? (contact.priority === 'critical' ? 'bg-red-500' : 'bg-orange-500')
                        : categories.find(cat => cat.id === contact.category)?.color || 'bg-gray-500'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        contact.category === 'emergency' ? 'bg-red-100 text-red-800' :
                        contact.category === 'hoa' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {categories.find(cat => cat.id === contact.category)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{contact.description}</p>
                  
                  <div className="space-y-3">
                    {contact.number && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>Phone:</span>
                        </div>
                        <a
                          href={`tel:${contact.number}`}
                          className="text-lg font-bold text-[#358939] hover:text-[#2d7230]"
                        >
                          {contact.number}
                        </a>
                      </div>
                    )}
                    
                    {contact.emergency && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span>Emergency:</span>
                        </div>
                        <a
                          href={`tel:${contact.emergency}`}
                          className="text-lg font-bold text-red-600 hover:text-red-700"
                        >
                          {contact.emergency}
                        </a>
                      </div>
                    )}
                    
                    {contact.email && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>Email:</span>
                        </div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-[#358939] hover:text-[#2d7230] break-all"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                    
                    {contact.address && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-600">{contact.address}</span>
                      </div>
                    )}
                    
                    {contact.available && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">{contact.available}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Quick Reference Guide</h2>
              <p className="text-xl text-white/90">Save these important numbers to your phone</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Emergency</h3>
                <p className="text-2xl font-bold">911</p>
                <p className="text-white/80 text-sm">Police, Fire, Medical</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Security</h3>
                <p className="text-xl font-bold">(555) 911-SAFE</p>
                <p className="text-white/80 text-sm">24/7 Community Security</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <Users className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">HOA Office</h3>
                <p className="text-xl font-bold">(555) 123-4567</p>
                <p className="text-white/80 text-sm">General Inquiries</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <Wrench className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Maintenance</h3>
                <p className="text-xl font-bold">(555) 911-FIXIT</p>
                <p className="text-white/80 text-sm">Emergency Repairs</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                Download PDF Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Important Information</h2>
            <p className="text-lg text-gray-600">Please read these important guidelines</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Life-Threatening Emergencies</h3>
              <p className="text-gray-600">
                Always call 911 first for medical emergencies, fires, crimes in progress, or any life-threatening situations.
              </p>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Security Protocols</h3>
              <p className="text-gray-600">
                For security issues within the community, contact our security first. They can coordinate with police if needed.
              </p>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">After Hours</h3>
              <p className="text-gray-600">
                Most services have after-hours emergency numbers. Use these only for true emergencies that cannot wait.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactDirectory