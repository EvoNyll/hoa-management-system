import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { newsAPI } from '../../services/news'
import { PageSpinner, CardSkeleton } from '../../components/common/LoadingSpinner'
import { Calendar, User, Star, ChevronRight, Filter, Search } from 'lucide-react'

const News = () => {
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    loadNews()
  }, [isAuthenticated])

  useEffect(() => {
    filterNews()
  }, [news, searchTerm, filterType])

  const loadNews = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock news data
      const mockNews = [
        {
          id: 1,
          title: "Summer Pool Schedule Update",
          content: "Dear Residents, We're excited to announce the updated summer pool schedule. The pool will now be open from 6 AM to 10 PM daily, with extended weekend hours. New pool furniture has been installed, and we've added more shade umbrellas for your comfort. Please remember to follow pool rules and supervise children at all times. Pool parties require advance booking through the HOA office. We look forward to seeing you enjoy our beautiful community pool this summer!",
          excerpt: "Updated summer pool hours and new amenities for residents to enjoy.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
          is_public: true,
          is_featured: true,
          author: { full_name: "Sarah Johnson" },
          created_at: "2024-07-25T10:00:00Z"
        },
        {
          id: 2,
          title: "Community BBQ Event - August 15th",
          content: "Join us for our annual community BBQ on August 15th at the community center! This year's theme is 'Summer Celebration' and we'll have live music, games for kids, and delicious food. The event starts at 5 PM and runs until 9 PM. We're looking for volunteers to help with setup and cleanup. Please RSVP by August 10th so we can plan accordingly. Bring your appetite and get ready to meet your neighbors!",
          excerpt: "Annual community BBQ event with live music and activities for the whole family.",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
          is_public: true,
          is_featured: true,
          author: { full_name: "Mike Wilson" },
          created_at: "2024-07-20T14:30:00Z"
        },
        {
          id: 3,
          title: "New Parking Regulations Effective August 1st",
          content: "Important update regarding parking regulations in our community. Starting August 1st, all vehicles must display current registration stickers. Guest parking is limited to 3 consecutive days. Oversized vehicles (RVs, boats, commercial trucks) must be parked in designated areas only. Violations will result in towing at the owner's expense. Please review the complete parking guidelines in your resident handbook or contact the HOA office for clarification.",
          excerpt: "Updated parking rules and regulations for all residents and guests.",
          image: null,
          is_public: true,
          is_featured: false,
          author: { full_name: "Administration" },
          created_at: "2024-07-18T09:15:00Z"
        },
        {
          id: 4,
          title: "Landscaping Maintenance Schedule",
          content: "Our landscaping team will be performing routine maintenance throughout the community over the next two weeks. Work will include tree trimming, hedge maintenance, and sprinkler system updates. Please be mindful of work crews and keep vehicles clear of marked areas. Any damage to personal property should be reported immediately to the HOA office. We appreciate your patience as we work to keep our community beautiful.",
          excerpt: "Scheduled landscaping maintenance activities across the community.",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
          is_public: false,
          is_featured: false,
          author: { full_name: "Maintenance Team" },
          created_at: "2024-07-15T11:45:00Z"
        },
        {
          id: 5,
          title: "Board Meeting Minutes - July 2024",
          content: "Minutes from the July board meeting are now available. Key topics discussed include budget approval for playground equipment upgrades, new security camera installation at the main entrance, and updates to the community website. The board approved a motion to increase the reserve fund contribution by 5% to ensure adequate funding for future capital improvements. Next board meeting is scheduled for August 20th at 7 PM in the community center.",
          excerpt: "Summary of July board meeting decisions and upcoming items.",
          image: null,
          is_public: false,
          is_featured: false,
          author: { full_name: "Board Secretary" },
          created_at: "2024-07-10T16:20:00Z"
        }
      ]

      // Filter news based on authentication status
      let filteredMockNews = mockNews
      if (!isAuthenticated || user?.role === 'guest') {
        filteredMockNews = mockNews.filter(article => article.is_public)
      }

      setNews(filteredMockNews)

    } catch (error) {
      console.error('Failed to load news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = news

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType === 'featured') {
      filtered = filtered.filter(article => article.is_featured)
    } else if (filterType === 'recent') {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return articleDate >= weekAgo
      })
    }

    setFilteredNews(filtered)
  }

  if (loading) {
    return <PageSpinner text="Loading community news..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community News & Announcements
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed about community updates, events, and important announcements
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search news articles..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Articles</option>
              <option value="featured">Featured</option>
              <option value="recent">Recent (7 days)</option>
            </select>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Limited Access
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You're viewing public announcements only. 
                    <a href="/login" className="font-medium underline hover:text-blue-600 ml-1">
                      Sign in
                    </a> to access all community news and member-exclusive content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Articles */}
        {filteredNews.some(article => article.is_featured) && filterType === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Featured News
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredNews
                .filter(article => article.is_featured)
                .slice(0, 2)
                .map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {article.excerpt || article.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          {article.author.full_name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {filterType === 'featured' ? 'Featured Articles' : 
             filterType === 'recent' ? 'Recent Articles' : 'All Articles'}
          </h2>
          
          {filteredNews.length > 0 ? (
            <div className="space-y-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start space-x-4">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        {article.is_featured && (
                          <div className="flex items-center mr-3">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                              Featured
                            </span>
                          </div>
                        )}
                        {!article.is_public && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Members Only
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {article.excerpt || article.content.substring(0, 200) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author.full_name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedArticle(null)}></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {selectedArticle.is_featured && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                      )}
                      {!selectedArticle.is_public && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Members Only
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="text-gray-400 hover:text-gray-500"
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
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedArticle.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default News