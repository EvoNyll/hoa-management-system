import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
  exportProfileData,
  getBasicProfile,
  updateBasicProfile,
  getResidenceInfo,
  updateResidenceInfo,
  getEmergencyInfo,
  updateEmergencyInfo,
  getPrivacySettings,
  updatePrivacySettings,
  getSecuritySettings,
  updateSecuritySettings,
  getFinancialInfo,
  updateFinancialInfo,
  getNotificationSettings,
  updateNotificationSettings,
  getSystemPreferences,
  updateSystemPreferences,
  getHouseholdMembers,
  addHouseholdMember,
  updateHouseholdMember,
  deleteHouseholdMember,
  getPets,
  addPet,
  updatePet,
  deletePet,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getCompletionStatus,
  getChangeLogs,
  changePassword
} from '../services/profileService'

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
  const [profileData, setProfileData] = useState({
    basic: {},
    residence: {},
    emergency: {},
    privacy: {},
    security: {},
    financial: {},
    notifications: {},
    system: {},
    household: [],
    pets: [],
    vehicles: [],
    changeLogs: [],
    completionStatus: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🚫 FIX INFINITE LOOP: Use useCallback to memoize functions
  const loadProfileData = useCallback(async () => {
    if (!user || !isAuthenticated) return

    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Loading profile data...')

      // Load all profile sections with error handling
      const results = await Promise.allSettled([
        getBasicProfile().catch(() => ({})),
        getResidenceInfo().catch(() => ({})),
        getEmergencyInfo().catch(() => ({})),
        getPrivacySettings().catch(() => ({})),
        getSecuritySettings().catch(() => ({})),
        getFinancialInfo().catch(() => ({})),
        getNotificationSettings().catch(() => ({})),
        getSystemPreferences().catch(() => ({})),
        getHouseholdMembers().catch(() => []),
        getPets().catch(() => []),
        getVehicles().catch(() => []),
        getCompletionStatus().catch(() => null),
        getChangeLogs().catch(() => [])
      ])

      setProfileData({
        basic: results[0].status === 'fulfilled' ? results[0].value : {},
        residence: results[1].status === 'fulfilled' ? results[1].value : {},
        emergency: results[2].status === 'fulfilled' ? results[2].value : {},
        privacy: results[3].status === 'fulfilled' ? results[3].value : {},
        security: results[4].status === 'fulfilled' ? results[4].value : {},
        financial: results[5].status === 'fulfilled' ? results[5].value : {},
        notifications: results[6].status === 'fulfilled' ? results[6].value : {},
        system: results[7].status === 'fulfilled' ? results[7].value : {},
        household: results[8].status === 'fulfilled' ? results[8].value : [],
        pets: results[9].status === 'fulfilled' ? results[9].value : [],
        vehicles: results[10].status === 'fulfilled' ? results[10].value : [],
        completionStatus: results[11].status === 'fulfilled' ? results[11].value : null,
        changeLogs: results[12].status === 'fulfilled' ? results[12].value : []
      })

      console.log('✅ Profile data loaded successfully')
    } catch (err) {
      console.error('❌ Failed to load profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }, [user, isAuthenticated]) // 

  const handleUpdateBasicProfile = useCallback(async (data) => {
    try {
      const updatedData = await updateBasicProfile(data)
      setProfileData(prev => ({
        ...prev,
        basic: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateResidenceInfo = useCallback(async (data) => {
    try {
      const updatedData = await updateResidenceInfo(data)
      setProfileData(prev => ({
        ...prev,
        residence: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateEmergencyInfo = useCallback(async (data) => {
    try {
      const updatedData = await updateEmergencyInfo(data)
      setProfileData(prev => ({
        ...prev,
        emergency: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdatePrivacySettings = useCallback(async (data) => {
    try {
      const updatedData = await updatePrivacySettings(data)
      setProfileData(prev => ({
        ...prev,
        privacy: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateSecuritySettings = useCallback(async (data) => {
    try {
      const updatedData = await updateSecuritySettings(data)
      setProfileData(prev => ({
        ...prev,
        security: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateFinancialInfo = useCallback(async (data) => {
    try {
      const updatedData = await updateFinancialInfo(data)
      setProfileData(prev => ({
        ...prev,
        financial: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateNotificationSettings = useCallback(async (data) => {
    try {
      const updatedData = await updateNotificationSettings(data)
      setProfileData(prev => ({
        ...prev,
        notifications: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  const handleChangePassword = useCallback(async (data) => {
    try {
      const result = await changePassword(data);
      
      // Optionally update any relevant profile data
      setProfileData(prev => ({
        ...prev,
        security: {
          ...prev.security,
          last_password_change: new Date().toISOString()
        }
      }));
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [])

  const handleUpdateSystemPreferences = useCallback(async (data) => {
    try {
      const updatedData = await updateSystemPreferences(data)
      setProfileData(prev => ({
        ...prev,
        system: updatedData
      }))
      return updatedData
    } catch (error) {
      throw error
    }
  }, [])

  // Household Members
  const handleAddHouseholdMember = useCallback(async (data) => {
    try {
      const newMember = await addHouseholdMember(data)
      setProfileData(prev => ({
        ...prev,
        household: [...prev.household, newMember]
      }))
      return newMember
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateHouseholdMember = useCallback(async (id, data) => {
    try {
      const updatedMember = await updateHouseholdMember(id, data)
      setProfileData(prev => ({
        ...prev,
        household: prev.household.map(member => 
          member.id === id ? updatedMember : member
        )
      }))
      return updatedMember
    } catch (error) {
      throw error
    }
  }, [])

  const handleDeleteHouseholdMember = useCallback(async (id) => {
    try {
      await deleteHouseholdMember(id)
      setProfileData(prev => ({
        ...prev,
        household: prev.household.filter(member => member.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }, [])

  // Pets
  const handleAddPet = useCallback(async (data) => {
    try {
      const newPet = await addPet(data)
      setProfileData(prev => ({
        ...prev,
        pets: [...prev.pets, newPet]
      }))
      return newPet
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdatePet = useCallback(async (id, data) => {
    try {
      const updatedPet = await updatePet(id, data)
      setProfileData(prev => ({
        ...prev,
        pets: prev.pets.map(pet => pet.id === id ? updatedPet : pet)
      }))
      return updatedPet
    } catch (error) {
      throw error
    }
  }, [])

  const handleDeletePet = useCallback(async (id) => {
    try {
      await deletePet(id)
      setProfileData(prev => ({
        ...prev,
        pets: prev.pets.filter(pet => pet.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }, [])

  // Vehicles
  const handleAddVehicle = useCallback(async (data) => {
    try {
      const newVehicle = await addVehicle(data)
      setProfileData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, newVehicle]
      }))
      return newVehicle
    } catch (error) {
      throw error
    }
  }, [])

  const handleUpdateVehicle = useCallback(async (id, data) => {
    try {
      const updatedVehicle = await updateVehicle(id, data)
      setProfileData(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(vehicle => 
          vehicle.id === id ? updatedVehicle : vehicle
        )
      }))
      return updatedVehicle
    } catch (error) {
      throw error
    }
  }, [])

  const handleDeleteVehicle = useCallback(async (id) => {
    try {
      await deleteVehicle(id)
      setProfileData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }, [])

  // Load change logs
  const loadChangeLogs = useCallback(async () => {
    try {
      const logs = await getChangeLogs()
      setProfileData(prev => ({
        ...prev,
        changeLogs: logs
      }))
      return logs
    } catch (error) {
      console.error('Failed to load change logs:', error)
      return []
    }
  }, [])

  // Export function
  const handleExportProfileData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Starting CSV export from ProfileContext...')
      await exportProfileData()
      console.log('✅ CSV export completed successfully')
      
    } catch (err) {
      console.error('❌ Failed to export profile data:', err)
      setError('Failed to export profile data')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = React.useMemo(() => ({
    // State
    profileData,
    loading,
    error,
    
    // Basic actions
    loadProfileData,
    clearError,
    
    // Update functions
    updateBasicProfile: handleUpdateBasicProfile,
    updateResidenceInfo: handleUpdateResidenceInfo,
    updateEmergencyInfo: handleUpdateEmergencyInfo,
    updatePrivacySettings: handleUpdatePrivacySettings,
    updateSecuritySettings: handleUpdateSecuritySettings,
    updateFinancialInfo: handleUpdateFinancialInfo,
    updateNotificationSettings: handleUpdateNotificationSettings,
    updateSystemPreferences: handleUpdateSystemPreferences,

    // Security actions
    changePassword: handleChangePassword,
    
    // Household members
    addHouseholdMember: handleAddHouseholdMember,
    updateHouseholdMember: handleUpdateHouseholdMember,
    deleteHouseholdMember: handleDeleteHouseholdMember,
    
    // Pets
    addPet: handleAddPet,
    updatePet: handleUpdatePet,
    deletePet: handleDeletePet,
    
    // Vehicles
    addVehicle: handleAddVehicle,
    updateVehicle: handleUpdateVehicle,
    deleteVehicle: handleDeleteVehicle,
    
    // Change logs
    loadChangeLogs,
    
    // Export
    exportProfileData: handleExportProfileData
  }), [
    profileData,
    loading,
    error,
    loadProfileData,
    clearError,
    handleUpdateBasicProfile,
    handleUpdateResidenceInfo,
    handleUpdateEmergencyInfo,
    handleUpdatePrivacySettings,
    handleUpdateSecuritySettings,
    handleUpdateFinancialInfo,
    handleUpdateNotificationSettings,
    handleUpdateSystemPreferences,
    handleAddHouseholdMember,
    handleUpdateHouseholdMember,
    handleDeleteHouseholdMember,
    handleAddPet,
    handleUpdatePet,
    handleDeletePet,
    handleAddVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    loadChangeLogs,
    handleExportProfileData
  ])

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}