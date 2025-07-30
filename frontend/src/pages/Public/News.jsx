// File: frontend/src/pages/Public/News.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Calendar, Tag, Search, Filter, ArrowRight, Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'
import { usePagination } from '../../hooks/usePagination'

const News = () => {
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const categories = [
    { id: 'all', name: 'All News', count: 12 },
    { id: 'announcements', name: 'Announcements', count: 5 },
    { id: 'events', name: 'Events', count: 3 },
    { id: 'maintenance', name: 'Maintenance', count: 2 },
    { id: 'community', name: 'Community', count: 2 }
  ]

  const featuredNews = [
    {
      id: 1,
      title: 'New Community Garden Project Approved',
      excerpt: 'The board has approved the new community garden project, which will begin construction next month.',
      content: 'We are excited to announce that the board has unanimously approved the new community garden project...',
      author: { full_name: 'HOA Board' },
      created_at: '2024-01-15',
      category: 'announcements',
      is_featured: true,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Swimming Pool Maintenance Schedule',
      excerpt: 'Please note the updated maintenance schedule for our community swimming pool during February.',
      content: 'The swimming pool will undergo routine maintenance during the following dates...',
      author: { full_name: 'Maintenance Team' },
      created_at: '2024-01-12',
      category: 'maintenance',
      is_featured: false
    },
    {
      id: 3,
      title: 'Annual HOA Meeting - March 15th',
      excerpt: 'Join us for our annual HOA meeting to discuss community updates and future plans.',
      content: 'Our annual HOA meeting is scheduled for March 15th at 7:00 PM in the clubhouse...',
      author: { full_name: 'Sarah Johnson' },
      created_at: '2024-01-10',
      category: 'events',
      is_featured: true
    },
    {
      id: 4,
      title: 'Security Updates and New Protocols',
      excerpt: 'Important security updates and new access protocols for all residents.',
      content: 'We have implemented new security measures to ensure the safety of our community...',
      author: { full_name: 'Security Team' },
      created_at: '2024-01-08',
      category: 'announcements',
      is_featured: false
    },
    {
      id: 5,
      title: 'Holiday Decoration Contest Winners',
      excerpt: 'Congratulations to our holiday decoration contest winners!',
      content: 'Thank you to everyone who participated in our annual holiday decoration contest...',
      author: { full_name: 'Events Committee' },
      created_at: '2024-01-05',
      category: 'community',
      is_featured: true
    },
    {
      id: 6,
      title: 'Playground Equipment Upgrade Complete',
      excerpt: 'The new playground equipment installation has been completed and is ready for use.',
      content: 'We are pleased to announce that the playground equipment upgrade has been completed...',
      author: { full_name: 'Maintenance Team' },
      created_at: '2024-01-03',
      category: 'maintenance',
      is_featured: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAllNews(featuredNews)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNews = allNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Use pagination hook with 6 items per page
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPrevPage
  } = usePagination(filteredNews, 6)

  const getCategoryColor = (category) => {
    const colors = {
      announcements: 'bg-blue-100 text-blue-800',
      events: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-orange-100 text-orange-800',
      community: 'bg-green-100 text-green-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Community News & Announcements"
        subtitle="Stay informed with the latest updates, announcements, and important information from your HOA community."
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'News']}
        height="min-h-[400px]"
      >
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news and announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl">
              Search
            </button>
          </div>
        </div>
      </HeroSection>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#358939] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentItems.map((article) => (
                      <article key={article.id} className="card group hover:shadow-xl transition-all duration-300">
                        {article.image && (
                          <div className="relative mb-6 overflow-hidden rounded-2xl">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {article.is_featured && (
                              <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center px-3 py-1 bg-[#358939] text-white text-sm font-medium rounded-full">
                                  <Bell className="w-4 h-4 mr-1" />
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                              <Tag className="w-3 h-3 mr-1" />
                              {article.category}
                            </span>
                            <time className="text-sm text-gray-500">
                              {new Date(article.created_at).toLocaleDateString()}
                            </time>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#358939] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="w-4 h-4 mr-2" />
                              {article.author.full_name}
                            </div>
                            <button
                              onClick={() => setSelectedArticle(article)}
                              className="text-[#358939] hover:text-[#2d7230] font-medium flex items-center gap-1 text-sm group-hover:translate-x-1 transition-all"
                            >
                              Read More <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-2xl sm:px-6">
                      {/* Mobile Pagination */}
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={goToPrevPage}
                          disabled={!hasPrevPage}
                          className="btn btn-outline disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700 flex items-center">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={goToNextPage}
                          disabled={!hasNextPage}
                          className="btn btn-outline disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                      
                      {/* Desktop Pagination */}
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{startIndex}</span> to{' '}
                            <span className="font-medium">{endIndex}</span> of{' '}
                            <span className="font-medium">{totalItems}</span> articles
                          </p>
                        </div>
                        
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={goToPrevPage}
                              disabled={!hasPrevPage}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  page === currentPage
                                    ? 'z-10 bg-[#358939] border-[#358939] text-white'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            
                            <button
                              onClick={goToNextPage}
                              disabled={!hasNextPage}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Bell className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Check back soon for community updates and announcements.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Never miss important community news and announcements. Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
              />
              <button className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedArticle.category)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {selectedArticle.category}
                    </span>
                    {selectedArticle.is_featured && (
                      <span className="inline-flex items-center px-3 py-1 bg-[#358939] text-white text-sm font-medium rounded-full">
                        <Bell className="w-4 h-4 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedArticle.image && (
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                  />
                )}

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedArticle.author.full_name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(selectedArticle.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default News