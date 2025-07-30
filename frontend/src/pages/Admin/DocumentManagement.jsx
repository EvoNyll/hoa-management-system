import React from 'react'
import { FileText, Upload, Folder } from 'lucide-react'

const DocumentManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
        <button className="btn btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <Folder className="w-8 h-8 text-yellow-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">File Management</h2>
            <p className="text-gray-600">Manage community documents and files</p>
          </div>
        </div>
        <p className="text-center text-gray-500 py-12">Document management features coming soon...</p>
      </div>
    </div>
  )
}

export default DocumentManagement