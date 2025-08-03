import React, { useState } from 'react'
import { 
  Phone, Mail, MapPin, Clock, Send, User, MessageSquare, 
  AlertCircle, CheckCircle, Shield, Wrench, Users, Calendar 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    isResident: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      details: '(555) 123-4567',
      description: 'Mon-Fri: 9AM-6PM, Sat: 10AM-2PM',
      action: 'tel:+15551234567',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@greenfieldHOA.com',
      description: 'We respond within 24 hours',
      action: 'mailto:info@greenfieldHOA.com',
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Greenfield Drive, Pleasant Valley, CA',
      description: 'Main Clubhouse Office',
      action: '#',
      color: 'bg-purple-500'
    }
  ]

  const emergencyContacts = [
    {
      icon: Shield,
      title: 'Security Emergency',
      number: '(555) 911-SAFE',
      description: '24/7 Security Hotline',
      color: 'bg-red-500'
    },
    {
      icon: Wrench,
      title: 'Maintenance Emergency',
      number: '(555) 911-FIXIT',
      description: 'After hours maintenance',
      color: 'bg-orange-500'
    },
    {
      icon: Phone,
      title: 'Medical Emergency',
      number: '911',
      description: 'Police, Fire, Ambulance',
      color: 'bg-red-600'
    }
  ]

  const departments = [
    {
      name: 'General Inquiry',
      email: 'info@greenfieldHOA.com',
      description: 'General questions and information'
    },
    {
      name: 'Board of Directors',
      email: 'board@greenfieldHOA.com',
      description: 'Board members and governance matters'
    },
    {
      name: 'Property Management',
      email: 'management@greenfieldHOA.com',
      description: 'Property issues and maintenance requests'
    },
    {
      name: 'Billing & Payments',
      email: 'billing@greenfieldHOA.com',
      description: 'HOA dues and payment inquiries'
    },
    {
      name: 'Architectural Committee',
      email: 'architectural@greenfieldHOA.com',
      description: 'Home modifications and improvements'
    }
  ]

  const categories = [
    'General Inquiry',
    'Maintenance Request',
    'Billing Question',
    'Architectural Approval',
    'Community Complaint',
    'Event Information',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        isResident: false
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Contact Us"
        subtitle="Get in touch with our team for any questions, concerns, or assistance. We're here to help make your community experience exceptional."
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Contact']}
        height="min-h-[400px]"
      />

      {/* Quick Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">Choose the best way to reach us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <a
                  key={index}
                  href={method.action}
                  className="card text-center group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 ${method.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#358939] transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-lg text-[#358939] font-semibold mb-2">{method.details}</p>
                  <p className="text-gray-600">{method.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="text-green-800 font-medium">Message Sent Successfully!</h4>
                    <p className="text-green-700 text-sm">We'll respond within 24 hours.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <h4 className="text-red-800 font-medium">Error Sending Message</h4>
                    <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-textarea"
                    required
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isResident"
                    checked={formData.isResident}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#358939] focus:ring-[#358939] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I am a current resident of Greenfield HOA
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-large w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-[#358939] mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Emergency services available 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Emergency Contacts</h3>
                </div>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => {
                    const IconComponent = contact.icon
                    return (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 ${contact.color} text-white rounded-lg flex items-center justify-center mr-3`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{contact.title}</h4>
                          <p className="text-sm text-gray-600">{contact.description}</p>
                        </div>
                        <a
                          href={`tel:${contact.number}`}
                          className="text-lg font-bold text-[#358939] hover:text-[#2d7230]"
                        >
                          {contact.number}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Department Contacts */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-[#358939] mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Department Contacts</h3>
                </div>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{dept.description}</p>
                      <a
                        href={`mailto:${dept.email}`}
                        className="text-sm text-[#358939] hover:text-[#2d7230] font-medium"
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">What are the office hours?</h3>
                <p className="text-gray-600">Our office is open Monday-Friday 9AM-6PM and Saturday 10AM-2PM. Emergency services are available 24/7.</p>
              </div>
              
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">How do I pay my HOA dues?</h3>
                <p className="text-gray-600">You can pay online through our resident portal, by mail, or visit our office during business hours.</p>
              </div>
              
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">Who do I contact for maintenance issues?</h3>
                <p className="text-gray-600">For non-emergency maintenance, contact our property management team. For emergencies, call our 24/7 maintenance hotline.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">How do I book community amenities?</h3>
                <p className="text-gray-600">Residents can book amenities through our online portal or by contacting the office directly.</p>
              </div>
              
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">What if I have a noise complaint?</h3>
                <p className="text-gray-600">Contact security first at (555) 911-SAFE. For ongoing issues, file a formal complaint with the office.</p>
              </div>
              
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-2">How do I get architectural approval?</h3>
                <p className="text-gray-600">Submit your plans to the Architectural Committee through our forms portal or email architectural@greenfieldHOA.com.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Visit Our Office
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Located in the main clubhouse, our office is easily accessible to all residents and visitors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Address</h3>
                <p className="text-white/90">
                  123 Greenfield Drive<br />
                  Pleasant Valley, CA 12345
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Parking</h3>
                <p className="text-white/90">
                  Free visitor parking available<br />
                  in front of the clubhouse
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                Get Directions
              </button>
              <button className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#358939]">
                View Map
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact