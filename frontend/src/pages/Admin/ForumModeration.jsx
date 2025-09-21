import React from 'react'
import { MessageSquare, Eye, Trash2 } from 'lucide-react'

const ForumModeration = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Forum Moderation</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Community Discussions</h2>
            <p className="text-gray-600 dark:text-gray-400">Moderate forum posts and discussions</p>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">Forum moderation features coming soon...</p>
      </div>
    </div>
  )
}

export default ForumModeration