import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageSpinner } from '../../components/common/LoadingSpinner'
import { cmsAPI } from '../../services/cms'
import { 
  MapPin, 
  Users, 
  Calendar, 
  Award, 
  Wifi, 
  Car, 
  Waves, 
  TreePine,
  Shield,
  Phone
} from 'lucide-react'

const About = () => {
  const [loading, setLoading] = useState(true)
  const [pageContent, setPageContent] = useState(null)

  useEffect(() => {
    loadPageContent()
  }, [])

  const loadPageContent = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock CMS content
      setPageContent({
        title: 'About Greenfield HOA',
        content: `Welcome to Greenfield HOA, a premier residential community that combines modern living with natural beauty. Established in 2015, our community has grown to become one of the most sought-after neighborhoods in the area.

Our community spans 25 acres of beautifully landscaped grounds, featuring tree-lined streets, walking trails, and thoughtfully designed common areas that bring neighbors together.`,
        updated_at: '2024-06-15T10:00:00Z'
      })

    } catch (error) {
      console.error('Failed to load page content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner text="Loading community information..." />
  }

  const amenities = [
    {
      name: 'Swimming Pool & Spa',
      description: 'Resort-style pool with heated spa and sundeck',
      icon: Waves,
      color: 'text-blue-600'
    },
    {
      name: 'Fitness Center',
      description: 'Fully equipped gym with modern equipment',
      icon: Award,
      color: 'text-green-600'
    },
    {
      name: 'Community Center',
      description: 'Event space for gatherings and celebrations',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      name: 'Walking Trails',
      description: 'Scenic paths throughout the community',
      icon: TreePine,
      color: 'text-emerald-600'
    },
    {
      name: 'Covered Parking',
      description: 'Protected parking for residents',
      icon: Car,
      color: 'text-gray-600'
    },
    {
      name: '24/7 Security',
      description: 'Gated community with security patrol',
      icon: Shield,
      color: 'text-red-600'
    }
  ]

  const communityFeatures = [
    {
      title: 'Prime Location',
      description: 'Conveniently located near shopping, dining, and entertainment',
      stats: '5 minutes to downtown'
    },
    {
      title: 'Family Friendly',
      description: 'Safe environment with playgrounds and family activities',
      stats: '50+ families'
    },
    {
      title: 'Well Maintained',
      description: 'Professional landscaping and maintenance services',
      stats: '99% satisfaction'
    },
    {
      title: 'Active Community',
      description: 'Regular events and activities for all ages',
      stats: '20+ events yearly'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent?.title || 'About Our Community'}
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              {pageContent?.content || 'Loading community information...'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">500+</div>
              <div className="text-gray-600 font-medium">Residents</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">25</div>
              <div className="text-gray-600 font-medium">Acres</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">10+</div>
              <div className="text-gray-600 font-medium">Amenities</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">2015</div>
              <div className="text-gray-600 font-medium">Established</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what makes our community a wonderful place to call home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="text-2xl font-bold text-[#39423B]">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community Amenities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy a wide range of amenities designed to enhance your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => {
              const IconComponent = amenity.icon
              return (
                <div key={index} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`w-8 h-8 ${amenity.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {amenity.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Location Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Prime Location
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">
                      123 Greenfield Drive<br />
                      Pleasant Valley, CA 94588
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-600">
                      HOA Office: (555) 123-4567<br />
                      Emergency: (555) 123-4568<br />
                      Email: info@greenfieldHOA.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive Map</p>
                <p className="text-sm text-gray-400">Community location and nearby amenities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Community Values
              </h2>
              <p className="text-gray-600">
                We're committed to maintaining a welcoming and well-maintained community for all residents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Respect & Courtesy</h3>
                  <p className="text-gray-600">
                    We foster a neighborly atmosphere where all residents feel welcome and respected. 
                    Courtesy and consideration for others are fundamental to our community spirit.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Maintenance</h3>
                  <p className="text-gray-600">
                    All residents are expected to maintain their properties to community standards, 
                    helping preserve property values and our beautiful environment.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Involvement</h3>
                  <p className="text-gray-600">
                    We encourage all residents to participate in community events and decision-making 
                    processes. Your involvement helps make our community stronger.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Stewardship</h3>
                  <p className="text-gray-600">
                    We're committed to sustainable practices and protecting our natural surroundings 
                    for current and future generations to enjoy.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex space-x-4">
                <Link
                  to="/documents"
                  className="btn btn-primary"
                >
                  View Community Rules
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline"
                >
                  Contact HOA Office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our History
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From groundbreaking to today, see how our community has grown and evolved
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2015</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Community Established</h3>
                  <p className="text-gray-600">
                    Greenfield HOA was officially established with the first 50 homes completed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2017</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Amenities Completed</h3>
                  <p className="text-gray-600">
                    Community center, pool, and fitness facilities opened to residents.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2020</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Digital Transformation</h3>
                  <p className="text-gray-600">
                    Launched online portal for payments, bookings, and community communication.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2024</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sustainability Initiative</h3>
                  <p className="text-gray-600">
                    Implemented solar panels and eco-friendly landscaping throughout the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About