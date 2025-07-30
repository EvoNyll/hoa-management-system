import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Home, Calendar, Shield, Heart, Star } from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const About = () => {
  const [pageContent, setPageContent] = useState(null)

  useEffect(() => {
    // Simulate loading page content from CMS
    setPageContent({
      title: 'About Our Community',
      content: 'Greenfield HOA is a vibrant residential community nestled in the heart of Pleasant Valley. Since our establishment in 2015, we have been committed to creating a safe, beautiful, and thriving neighborhood where families can grow and prosper together.'
    })
  }, [])

  const communityFeatures = [
    {
      icon: Home,
      title: 'Beautiful Homes',
      description: 'Modern architecture and well-maintained properties throughout our 25-acre community',
      stats: '500+ homes'
    },
    {
      icon: Shield,
      title: 'Security & Safety',
      description: '24/7 security patrols and gated entry ensure peace of mind for all residents',
      stats: '24/7 security'
    },
    {
      icon: Heart,
      title: 'Community Spirit',
      description: 'Strong neighborhood bonds through regular events and activities for all ages',
      stats: '20+ events yearly'
    },
    {
      icon: Calendar,
      title: 'Modern Amenities',
      description: 'State-of-the-art clubhouse, swimming pool, fitness center, and recreational facilities',
      stats: '10+ amenities'
    }
  ]

  const stats = [
    { number: '500+', label: 'Residents' },
    { number: '25', label: 'Acres' },
    { number: '10+', label: 'Amenities' },
    { number: '2015', label: 'Established' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="About Our Community"
        subtitle="Discover the story behind Greenfield HOA and what makes our community a wonderful place to call home."
        backgroundImage="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'About Us']}
      />

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-[#358939]/10 text-[#358939] rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 mr-2" />
                  OUR COMMUNITY
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Where Wanderlust Meets Dream Destinations
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {pageContent?.content || 'Loading community information...'}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our community is built on the foundation of mutual respect, shared values, and a commitment to maintaining the highest standards of living. We take pride in our beautiful landscaping, well-maintained common areas, and strong sense of community that makes Greenfield HOA truly special.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/board-members"
                  className="btn btn-primary btn-large"
                >
                  Meet the Board
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline btn-large"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#358939] rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                      <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#7CB342] rounded-full flex items-center justify-center">
                <Home className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#358939]/10 text-[#358939] rounded-full text-sm font-semibold mb-6">
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Unforgettable Getaways<br />
              Escaping Routine
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our community offers everything you need for comfortable, convenient, and enjoyable living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="card text-center group hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-[#358939] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#358939] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="text-[#358939] font-semibold text-sm">
                    {feature.stats}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the best of community living in Greenfield HOA. Contact us today to learn more about available properties and membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl"
              >
                Get Started
              </Link>
              <Link
                to="/documents"
                className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#358939]"
              >
                View Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About