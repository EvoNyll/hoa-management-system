// frontend/src/context/ProfileContext.jsx
// REPLACE YOUR ENTIRE FILE WITH THIS

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { exportProfileData } from '../services/profileService' // IMPORT DIRECTLY

const ProfileContext = createContext({})

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [profileData, setProfileData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Export function that ONLY calls the CSV export
  const handleExportProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Starting CSV export from ProfileContext...')
      
      // Call the CSV export function directly
      await exportProfileData()
      
      console.log('✅ CSV export completed successfully')
      
    } catch (err) {
      console.error('❌ Failed to export profile data:', err)
      setError('Failed to export profile data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    // State
    profileData,
    loading,
    error,
    
    // Actions
    clearError,
    
    // Export - CSV ONLY
    exportProfileData: handleExportProfileData, // Use our wrapper function
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}