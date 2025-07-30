import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className={`${sizeClasses[size]} animate-spin mx-auto mb-4 border-4 border-gray-200 border-t-green-600 rounded-full`}></div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  )
}

export const InlineSpinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-4'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin border-gray-200 border-t-current rounded-full ${className}`}></div>
  )
}

export const PageSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-gray-200 border-t-green-600 rounded-full"></div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner