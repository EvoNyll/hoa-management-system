import React from 'react'
import { FileText, Download, Lock } from 'lucide-react'

const Documents = () => {
  const documents = [
    {
      id: 1,
      title: 'Community Rules & Regulations',
      description: 'Official HOA rules and community guidelines',
      isPublic: true,
      fileSize: '2.3 MB'
    },
    {
      id: 2,
      title: 'HOA Bylaws',
      description: 'Legal governing documents for the association',
      isPublic: true,
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Architectural Guidelines',
      description: 'Guidelines for home modifications and improvements',
      isPublic: false,
      fileSize: '1.2 MB'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documents</h1>
            <p className="text-gray-600">Access community documents and forms</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <FileText className="w-8 h-8 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.title}</h3>
                    <p className="text-gray-600 mb-2">{doc.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Size: {doc.fileSize}</span>
                      {!doc.isPublic && (
                        <div className="flex items-center">
                          <Lock className="w-3 h-3 mr-1" />
                          <span>Members Only</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {doc.isPublic ? (
                    <button className="btn btn-outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  ) : (
                    <div className="text-center">
                      <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Login Required</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Login prompt for non-public documents */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <div className="text-center">
            <Lock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access More Documents</h3>
            <p className="text-gray-600 mb-4">
              Sign in to access additional forms, architectural guidelines, and member resources.
            </p>
            <a href="/login" className="btn btn-primary">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documents