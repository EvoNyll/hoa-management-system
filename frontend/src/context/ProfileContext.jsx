// frontend/src/context/ProfileContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
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
  getChangeLogs
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

  // Load all profile data
  const loadProfileData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Loading profile data...')

      // Load all profile sections
      const [
        basicData,
        residenceData,
        emergencyData,
        privacyData,
        securityData,
        financialData,
        notificationData,
        systemData,
        householdData,
        petsData,
        vehiclesData,
        completionData,
        changeLogsData
      ] = await Promise.allSettled([
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
        basic: basicData.status === 'fulfilled' ? basicData.value : {},
        residence: residenceData.status === 'fulfilled' ? residenceData.value : {},
        emergency: emergencyData.status === 'fulfilled' ? emergencyData.value : {},
        privacy: privacyData.status === 'fulfilled' ? privacyData.value : {},
        security: securityData.status === 'fulfilled' ? securityData.value : {},
        financial: financialData.status === 'fulfilled' ? financialData.value : {},
        notifications: notificationData.status === 'fulfilled' ? notificationData.value : {},
        system: systemData.status === 'fulfilled' ? systemData.value : {},
        household: householdData.status === 'fulfilled' ? householdData.value : [],
        pets: petsData.status === 'fulfilled' ? petsData.value : [],
        vehicles: vehiclesData.status === 'fulfilled' ? vehiclesData.value : [],
        changeLogs: changeLogsData.status === 'fulfilled' ? changeLogsData.value : [],
        completionStatus: completionData.status === 'fulfilled' ? completionData.value : null
      })

      console.log('✅ Profile data loaded successfully')
    } catch (err) {
      console.error('❌ Failed to load profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  // Update functions with local state updates
  const handleUpdateBasicProfile = async (data) => {
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
  }

  const handleUpdateResidenceInfo = async (data) => {
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
  }

  const handleUpdateEmergencyInfo = async (data) => {
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
  }

  const handleUpdatePrivacySettings = async (data) => {
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
  }

  const handleUpdateSecuritySettings = async (data) => {
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
  }

  const handleUpdateFinancialInfo = async (data) => {
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
  }

  const handleUpdateNotificationSettings = async (data) => {
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
  }

  const handleUpdateSystemPreferences = async (data) => {
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
  }

  // Household Members
  const handleAddHouseholdMember = async (data) => {
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
  }

  const handleUpdateHouseholdMember = async (id, data) => {
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
  }

  const handleDeleteHouseholdMember = async (id) => {
    try {
      await deleteHouseholdMember(id)
      setProfileData(prev => ({
        ...prev,
        household: prev.household.filter(member => member.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }

  // Pets
  const handleAddPet = async (data) => {
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
  }

  const handleUpdatePet = async (id, data) => {
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
  }

  const handleDeletePet = async (id) => {
    try {
      await deletePet(id)
      setProfileData(prev => ({
        ...prev,
        pets: prev.pets.filter(pet => pet.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }

  // Vehicles
  const handleAddVehicle = async (data) => {
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
  }

  const handleUpdateVehicle = async (id, data) => {
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
  }

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteVehicle(id)
      setProfileData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
      }))
    } catch (error) {
      throw error
    }
  }

  // Export function
  const handleExportProfileData = async () => {
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
  }

  const clearError = () => setError(null)

  const value = {
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
    
    // Export
    exportProfileData: handleExportProfileData
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}