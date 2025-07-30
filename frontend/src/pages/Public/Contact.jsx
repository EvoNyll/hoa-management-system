import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAlert } from '../../context/AlertContext'
import { InlineSpinner } from '../../components/common/LoadingSpinner'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
})

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useAlert()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))
        showSuccess('Message sent successfully! We\'ll get back to you soon.')
        resetForm()
      } catch (error) {
        showError('Failed to send message. Please try again.')
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600">Get in touch with our HOA team</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    123 Greenfield Drive<br />
                    Pleasant Valley, CA 94588
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@greenfieldHOA.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 card">
              <h3 className="font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div className="text-gray-600 space-y-1">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Your full name"
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="form-error">{formik.errors.name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="your.email@example.com"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="form-error">{formik.errors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className={`form-input ${
                    formik.touched.subject && formik.errors.subject
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="What is this regarding?"
                  {...formik.getFieldProps('subject')}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <p className="form-error">{formik.errors.subject}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className={`form-textarea ${
                    formik.touched.message && formik.errors.message
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  placeholder="Tell us how we can help you..."
                  {...formik.getFieldProps('message')}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="form-error">{formik.errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !formik.isValid}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <InlineSpinner className="mr-2" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact