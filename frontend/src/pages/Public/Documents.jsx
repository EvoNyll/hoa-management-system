// File: frontend/src/pages/Public/Documents.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, Download, Eye, Search, Filter, Folder, 
  Calendar, User, ArrowRight, Shield, Book, Gavel, 
  ClipboardList, AlertCircle 
} from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const Documents = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Documents', count: 15, icon: FileText },
    { id: 'governing', name: 'Governing Documents', count: 4, icon: Gavel },
    { id: 'policies', name: 'Policies & Rules', count: 6, icon: Book },
    { id: 'forms', name: 'Forms & Applications', count: 3, icon: ClipboardList },
    { id: 'financial', name: 'Financial Reports', count: 2, icon: Shield }
  ]

  const documentLibrary = [
    {
      id: 1,
      title: 'Community Bylaws',
      description: 'Official community bylaws governing HOA operations and resident rights',
      category: 'governing',
      fileType: 'PDF',
      fileSize: '2.3 MB',
      lastUpdated: '2024-01-15',
      downloads: 234,
      isPublic: true,
      featured: true,
      author: 'HOA Board'
    },
    {
      id: 2,
      title: 'Architectural Guidelines',
      description: 'Comprehensive guidelines for home modifications and architectural standards',
      category: 'policies',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      lastUpdated: '2024-01-10',
      downloads: 156,
      isPublic: true,
      featured: true,
      author: 'Architectural Committee'
    },
    {
      id: 3,
      title: 'Pool & Recreation Rules',
      description: 'Rules and regulations for community pool and recreational facilities',
      category: 'policies',
      fileType: 'PDF',
      fileSize: '0.9 MB',
      lastUpdated: '2024-01-08',
      downloads: 89,
      isPublic: true,
      featured: false,
      author: 'Recreation Committee'
    },
    {
      id: 4,
      title: 'Maintenance Request Form',
      description: 'Standard form for submitting maintenance and repair requests',
      category: 'forms',
      fileType: 'PDF',
      fileSize: '0.2 MB',
      lastUpdated: '2024-01-05',
      downloads: 345,
      isPublic: true,
      featured: false,
      author: 'Maintenance Team'
    },
    {
      id: 5,
      title: 'Annual Budget Report 2024',
      description: 'Detailed financial report and budget breakdown for the current year',
      category: 'financial',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      lastUpdated: '2024-01-01',
      downloads: 78,
      isPublic: true,
      featured: true,
      author: 'Finance Committee'
    },
    {
      id: 6,
      title: 'Parking Guidelines',
      description: 'Community parking rules, guest parking, and violation procedures',
      category: 'policies',
      fileType: 'PDF',
      fileSize: '0.7 MB',
      lastUpdated: '2023-12-20',
      downloads: 167,
      isPublic: true,
      featured: false,
      author: 'HOA Management'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments(documentLibrary)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category)
    return categoryData ? categoryData.icon : FileText
  }

  const getCategoryColor = (category) => {
    const colors = {
      governing: 'bg-red-100 text-red-800 border-red-200',
      policies: 'bg-blue-100 text-blue-800 border-blue-200',
      forms: 'bg-green-100 text-green-800 border-green-200',
      financial: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleDownload = (document) => {
    // Simulate download
    console.log(`Downloading: ${document.title}`)
    // In real implementation, this would trigger the actual download
  }

  const handlePreview = (document) => {
    // Simulate preview
    console.log(`Previewing: ${document.title}`)
    // In real implementation, this would open a document viewer
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Document Library"
        subtitle="Access important community documents, forms, policies, and resources. All the information you need for community living."
        backgroundImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Documents']}
        height="min-h-[400px]"
      >
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
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

      {/* Category Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 border-2 ${
                    selectedCategory === category.id
                      ? 'bg-[#358939] text-white border-[#358939] shadow-lg'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-white' : 'text-[#358939]'
                  }`} />
                  <div className={`font-medium text-sm ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </div>
                  <div className={`text-xs mt-1 ${
                    selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.count} docs
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Some documents may require resident login to access. Public documents are available to all visitors.
                <Link to="/login" className="ml-2 font-medium underline hover:no-underline">
                  Login here →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card">
                  <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDocuments.map((document) => {
                    const IconComponent = getCategoryIcon(document.category)
                    return (
                      <div key={document.id} className="card group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#358939]/10 rounded-xl flex items-center justify-center group-hover:bg-[#358939] transition-colors">
                              <IconComponent className="w-6 h-6 text-[#358939] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(document.category)}`}>
                                {document.category}
                              </span>
                            </div>
                          </div>
                          
                          {document.featured && (
                            <span className="inline-flex items-center px-2 py-1 bg-[#358939] text-white text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#358939] transition-colors">
                          {document.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {document.description}
                        </p>
                        
                        <div className="space-y-2 text-xs text-gray-500 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {document.fileType}
                            </div>
                            <div>{document.fileSize}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Updated {new Date(document.lastUpdated).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Download className="w-3 h-3 mr-1" />
                              {document.downloads}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {document.author}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handlePreview(document)}
                            className="flex-1 btn btn-outline btn-sm text-xs py-2 px-3 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="flex-1 btn btn-primary btn-sm text-xs py-2 px-3 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms or category filter.' : 'No documents available in this category.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-lg text-gray-600">Frequently accessed documents and forms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentLibrary.filter(doc => doc.featured).map((document) => {
              const IconComponent = getCategoryIcon(document.category)
              return (
                <div key={`quick-${document.id}`} className="bg-gradient-to-br from-[#358939] to-[#7CB342] rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{document.title}</h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{document.description}</p>
                  <button
                    onClick={() => handleDownload(document)}
                    className="flex items-center text-white font-medium text-sm hover:text-white/80 transition-colors"
                  >
                    Download Now <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Need Help Finding a Document?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is here to help you locate the right documents and information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn btn-large bg-white text-[#358939] hover:bg-gray-100 shadow-xl hover:shadow-2xl"
              >
                Contact Support
              </Link>
              <Link
                to="/login"
                className="btn btn-large btn-outline border-white text-white hover:bg-white hover:text-[#358939]"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Documents