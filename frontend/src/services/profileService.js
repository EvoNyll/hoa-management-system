// frontend/src/services/profileService.js
import api from './api'

// Profile Management
export const getBasicProfile = async () => {
  try {
    const response = await api.get('/users/profile/basic/')
    return response.data
  } catch (error) {
    console.error('Get basic profile error:', error)
    throw error
  }
}

export const updateBasicProfile = async (data) => {
  try {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'profile_photo' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, data[key])
        }
      }
    })
    
    const response = await api.put('/users/profile/basic/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Update basic profile error:', error)
    throw error
  }
}

export const getResidenceInfo = async () => {
  try {
    const response = await api.get('/users/profile/residence/')
    return response.data
  } catch (error) {
    console.error('Get residence info error:', error)
    throw error
  }
}

export const updateResidenceInfo = async (data) => {
  try {
    const response = await api.put('/users/profile/residence/', data)
    return response.data
  } catch (error) {
    console.error('Update residence info error:', error)
    throw error
  }
}

export const getEmergencyInfo = async () => {
  try {
    const response = await api.get('/users/profile/emergency/')
    return response.data
  } catch (error) {
    console.error('Get emergency info error:', error)
    throw error
  }
}

export const updateEmergencyInfo = async (data) => {
  try {
    const response = await api.put('/users/profile/emergency/', data)
    return response.data
  } catch (error) {
    console.error('Update emergency info error:', error)
    throw error
  }
}

export const getPrivacySettings = async () => {
  try {
    const response = await api.get('/users/profile/privacy/')
    return response.data
  } catch (error) {
    console.error('Get privacy settings error:', error)
    throw error
  }
}

export const updatePrivacySettings = async (data) => {
  try {
    const response = await api.put('/users/profile/privacy/', data)
    return response.data
  } catch (error) {
    console.error('Update privacy settings error:', error)
    throw error
  }
}

export const getFinancialInfo = async () => {
  try {
    const response = await api.get('/users/profile/financial/')
    return response.data
  } catch (error) {
    console.error('Get financial info error:', error)
    throw error
  }
}

export const updateFinancialInfo = async (data) => {
  try {
    const response = await api.put('/users/profile/financial/', data)
    return response.data
  } catch (error) {
    console.error('Update financial info error:', error)
    throw error
  }
}

export const getNotificationSettings = async () => {
  try {
    const response = await api.get('/users/profile/notifications/')
    return response.data
  } catch (error) {
    console.error('Get notification settings error:', error)
    throw error
  }
}

export const updateNotificationSettings = async (data) => {
  try {
    const response = await api.put('/users/profile/notifications/', data)
    return response.data
  } catch (error) {
    console.error('Update notification settings error:', error)
    throw error
  }
}

export const getSystemPreferences = async () => {
  try {
    const response = await api.get('/users/profile/system/')
    return response.data
  } catch (error) {
    console.error('Get system preferences error:', error)
    throw error
  }
}

export const updateSystemPreferences = async (data) => {
  try {
    const response = await api.put('/users/profile/system/', data)
    return response.data
  } catch (error) {
    console.error('Update system preferences error:', error)
    throw error
  }
}

export const getCompleteProfile = async () => {
  try {
    const response = await api.get('/users/profile/complete/')
    return response.data
  } catch (error) {
    console.error('Get complete profile error:', error)
    throw error
  }
}

export const getHouseholdMembers = async () => {
  try {
    const response = await api.get('/users/household-members/')
    return response.data
  } catch (error) {
    console.error('Get household members error:', error)
    throw error
  }
}

export const createHouseholdMember = async (data) => {
  try {
    const response = await api.post('/users/household-members/', data)
    return response.data
  } catch (error) {
    console.error('Create household member error:', error)
    throw error
  }
}

export const getHouseholdMember = async (id) => {
  try {
    const response = await api.get(`/users/household-members/${id}/`)
    return response.data
  } catch (error) {
    console.error('Get household member error:', error)
    throw error
  }
}

export const updateHouseholdMember = async (id, data) => {
  try {
    const response = await api.put(`/users/household-members/${id}/`, data)
    return response.data
  } catch (error) {
    console.error('Update household member error:', error)
    throw error
  }
}

export const deleteHouseholdMember = async (id) => {
  try {
    await api.delete(`/users/household-members/${id}/`)
    return { success: true }
  } catch (error) {
    console.error('Delete household member error:', error)
    throw error
  }
}

export const getPets = async () => {
  try {
    const response = await api.get('/users/pets/')
    return response.data
  } catch (error) {
    console.error('Get pets error:', error)
    throw error
  }
}

export const createPet = async (data) => {
  try {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'photo' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, data[key])
        }
      }
    })
    
    const response = await api.post('/users/pets/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Create pet error:', error)
    throw error
  }
}

export const updatePet = async (id, data) => {
  try {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'photo' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, data[key])
        }
      }
    })
    
    const response = await api.put(`/users/pets/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Update pet error:', error)
    throw error
  }
}

export const deletePet = async (id) => {
  try {
    await api.delete(`/users/pets/${id}/`)
    return { success: true }
  } catch (error) {
    console.error('Delete pet error:', error)
    throw error
  }
}

export const getVehicles = async () => {
  try {
    const response = await api.get('/users/vehicles/')
    return response.data
  } catch (error) {
    console.error('Get vehicles error:', error)
    throw error
  }
}

export const createVehicle = async (data) => {
  try {
    const response = await api.post('/users/vehicles/', data)
    return response.data
  } catch (error) {
    console.error('Create vehicle error:', error)
    throw error
  }
}

export const updateVehicle = async (id, data) => {
  try {
    const response = await api.put(`/users/vehicles/${id}/`, data)
    return response.data
  } catch (error) {
    console.error('Update vehicle error:', error)
    throw error
  }
}

export const deleteVehicle = async (id) => {
  try {
    await api.delete(`/users/vehicles/${id}/`)
    return { success: true }
  } catch (error) {
    console.error('Delete vehicle error:', error)
    throw error
  }
}

export const changePassword = async (data) => {
  try {
    const response = await api.post('/users/security/change-password/', data)
    return response.data
  } catch (error) {
    console.error('Change password error:', error)
    throw error
  }
}

export const requestEmailVerification = async (data) => {
  try {
    const response = await api.post('/users/security/request-email-verification/', data)
    return response.data
  } catch (error) {
    console.error('Request email verification error:', error)
    throw error
  }
}

export const verifyEmail = async (data) => {
  try {
    const response = await api.post('/users/security/verify-email/', data)
    return response.data
  } catch (error) {
    console.error('Verify email error:', error)
    throw error
  }
}

export const requestPhoneVerification = async (data) => {
  try {
    const response = await api.post('/users/security/request-phone-verification/', data)
    return response.data
  } catch (error) {
    console.error('Request phone verification error:', error)
    throw error
  }
}

export const verifyPhone = async (data) => {
  try {
    const response = await api.post('/users/security/verify-phone/', data)
    return response.data
  } catch (error) {
    console.error('Verify phone error:', error)
    throw error
  }
}

export const getCompletionStatus = async () => {
  try {
    const response = await api.get('/users/profile/completion-status/')
    return response.data
  } catch (error) {
    console.error('Get completion status error:', error)
    throw error
  }
}

export const getChangeLogs = async () => {
  try {
    const response = await api.get('/users/profile/change-logs/')
    return response.data
  } catch (error) {
    console.error('Get change logs error:', error)
    throw error
  }
}

export const exportProfileData = async () => {
  try {
    console.log('📊 Exporting profile data as CSV...')
    const response = await api.post('/users/profile/export-data/')
    
    const profileData = response.data
    
    // Create comprehensive CSV content
    let csvContent = ''
    
    // Header
    csvContent += 'HOA RESIDENT PROFILE DATA\n'
    csvContent += 'Generated: ' + new Date().toLocaleString() + '\n\n'
    
    // Basic Information
    csvContent += 'BASIC INFORMATION\n'
    csvContent += 'Field,Value\n'
    csvContent += '"Full Name","' + (profileData.basic_info?.full_name || '') + '"\n'
    csvContent += '"Email","' + (profileData.basic_info?.email || '') + '"\n'
    csvContent += '"Phone","' + (profileData.basic_info?.phone || '') + '"\n'
    csvContent += '"Role","' + (profileData.basic_info?.role || '') + '"\n'
    csvContent += '"Unit Number","' + (profileData.basic_info?.unit_number || '') + '"\n'
    csvContent += '"Move-in Date","' + (profileData.basic_info?.move_in_date || '') + '"\n'
    csvContent += '"Property Type","' + (profileData.basic_info?.property_type || '') + '"\n'
    csvContent += '"Parking Spaces","' + (profileData.basic_info?.parking_spaces || '') + '"\n'
    csvContent += '"Mailbox Number","' + (profileData.basic_info?.mailbox_number || '') + '"\n\n'
    
    // Emergency Contacts
    csvContent += 'EMERGENCY CONTACTS\n'
    csvContent += 'Contact Type,Name,Phone,Relationship\n'
    csvContent += '"Primary","' + (profileData.basic_info?.emergency_contact || '') + '","' + (profileData.basic_info?.emergency_phone || '') + '","' + (profileData.basic_info?.emergency_relationship || '') + '"\n'
    csvContent += '"Secondary","' + (profileData.basic_info?.secondary_emergency_contact || '') + '","' + (profileData.basic_info?.secondary_emergency_phone || '') + '","' + (profileData.basic_info?.secondary_emergency_relationship || '') + '"\n\n'
    
    // Household Members
    if (profileData.household_members && profileData.household_members.length > 0) {
      csvContent += 'HOUSEHOLD MEMBERS\n'
      csvContent += 'Full Name,Relationship,Date of Birth,Phone,Email,Is Minor,Has Key Access\n'
      profileData.household_members.forEach(member => {
        csvContent += '"' + (member.full_name || '') + '","' + (member.relationship || '') + '","' + (member.date_of_birth || '') + '","' + (member.phone || '') + '","' + (member.email || '') + '","' + (member.is_minor ? 'Yes' : 'No') + '","' + (member.has_key_access ? 'Yes' : 'No') + '"\n'
      })
      csvContent += '\n'
    }
    
    // Pets
    if (profileData.pets && profileData.pets.length > 0) {
      csvContent += 'PETS\n'
      csvContent += 'Name,Type,Breed,Color,Weight,Date of Birth,Microchip,Vaccination Current\n'
      profileData.pets.forEach(pet => {
        csvContent += '"' + (pet.name || '') + '","' + (pet.pet_type || '') + '","' + (pet.breed || '') + '","' + (pet.color || '') + '","' + (pet.weight || '') + '","' + (pet.date_of_birth || '') + '","' + (pet.microchip_number || '') + '","' + (pet.vaccination_current ? 'Yes' : 'No') + '"\n'
      })
      csvContent += '\n'
    }
    
    // Vehicles
    if (profileData.vehicles && profileData.vehicles.length > 0) {
      csvContent += 'VEHICLES\n'
      csvContent += 'License Plate,Make,Model,Year,Color,Type,Primary Vehicle,Permit Number\n'
      profileData.vehicles.forEach(vehicle => {
        csvContent += '"' + (vehicle.license_plate || '') + '","' + (vehicle.make || '') + '","' + (vehicle.model || '') + '","' + (vehicle.year || '') + '","' + (vehicle.color || '') + '","' + (vehicle.vehicle_type || '') + '","' + (vehicle.is_primary ? 'Yes' : 'No') + '","' + (vehicle.parking_permit_number || '') + '"\n'
      })
      csvContent += '\n'
    }
    
    // Privacy Settings
    csvContent += 'PRIVACY & SETTINGS\n'
    csvContent += 'Setting,Value\n'
    csvContent += '"Directory Visible","' + (profileData.basic_info?.is_directory_visible ? 'Yes' : 'No') + '"\n'
    csvContent += '"Show Name in Directory","' + (profileData.basic_info?.directory_show_name ? 'Yes' : 'No') + '"\n'
    csvContent += '"Show Unit in Directory","' + (profileData.basic_info?.directory_show_unit ? 'Yes' : 'No') + '"\n'
    csvContent += '"Show Phone in Directory","' + (profileData.basic_info?.directory_show_phone ? 'Yes' : 'No') + '"\n'
    csvContent += '"Show Email in Directory","' + (profileData.basic_info?.directory_show_email ? 'Yes' : 'No') + '"\n'
    csvContent += '"Email Notifications","' + (profileData.basic_info?.email_notifications ? 'Enabled' : 'Disabled') + '"\n'
    csvContent += '"SMS Notifications","' + (profileData.basic_info?.sms_notifications ? 'Enabled' : 'Disabled') + '"\n'
    csvContent += '"Preferred Contact Method","' + (profileData.basic_info?.preferred_contact_method || '') + '"\n'
    csvContent += '"Best Contact Time","' + (profileData.basic_info?.best_contact_time || '') + '"\n'
    csvContent += '"Language Preference","' + (profileData.basic_info?.language_preference || '') + '"\n'
    csvContent += '"Theme Preference","' + (profileData.basic_info?.theme_preference || '') + '"\n'
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'HOA_Profile_Data_' + new Date().toISOString().split('T')[0] + '.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('✅ CSV file downloaded successfully')
    return profileData
  } catch (error) {
    console.error('❌ Export profile data error:', error)
    throw error
  }
}

export const exportProfileDataAsText = async () => {
  try {
    console.log('📝 Exporting profile data as formatted text...')
    const response = await api.post('/users/profile/export-data/')
    
    const profileData = response.data
    
    // Create formatted text content
    let textContent = 'HOA RESIDENT PROFILE DATA\n'
    textContent += 'Generated: ' + new Date().toLocaleString() + '\n'
    textContent += '==================================================\n\n'
    
    // Basic Information
    if (profileData.basic_info) {
      textContent += 'BASIC INFORMATION\n'
      textContent += '--------------------\n'
      textContent += 'Full Name: ' + (profileData.basic_info.full_name || 'N/A') + '\n'
      textContent += 'Email: ' + (profileData.basic_info.email || 'N/A') + '\n'
      textContent += 'Phone: ' + (profileData.basic_info.phone || 'N/A') + '\n'
      textContent += 'Role: ' + (profileData.basic_info.role || 'N/A') + '\n'
      textContent += 'Unit Number: ' + (profileData.basic_info.unit_number || 'N/A') + '\n'
      textContent += 'Move-in Date: ' + (profileData.basic_info.move_in_date || 'N/A') + '\n'
      textContent += 'Property Type: ' + (profileData.basic_info.property_type || 'N/A') + '\n\n'
    }
    
    // Emergency Contacts
    textContent += 'EMERGENCY CONTACTS\n'
    textContent += '--------------------\n'
    if (profileData.basic_info?.emergency_contact) {
      textContent += 'Primary Contact: ' + profileData.basic_info.emergency_contact + '\n'
      textContent += 'Primary Phone: ' + (profileData.basic_info.emergency_phone || 'N/A') + '\n'
      textContent += 'Primary Relationship: ' + (profileData.basic_info.emergency_relationship || 'N/A') + '\n'
    }
    if (profileData.basic_info?.secondary_emergency_contact) {
      textContent += 'Secondary Contact: ' + profileData.basic_info.secondary_emergency_contact + '\n'
      textContent += 'Secondary Phone: ' + (profileData.basic_info.secondary_emergency_phone || 'N/A') + '\n'
      textContent += 'Secondary Relationship: ' + (profileData.basic_info.secondary_emergency_relationship || 'N/A') + '\n'
    }
    textContent += '\n'
    
    // Household Members
    if (profileData.household_members && profileData.household_members.length > 0) {
      textContent += 'HOUSEHOLD MEMBERS\n'
      textContent += '--------------------\n'
      profileData.household_members.forEach((member, index) => {
        textContent += (index + 1) + '. ' + (member.full_name || 'N/A') + '\n'
        textContent += '   Relationship: ' + (member.relationship || 'N/A') + '\n'
        textContent += '   Phone: ' + (member.phone || 'N/A') + '\n'
        textContent += '   Email: ' + (member.email || 'N/A') + '\n'
        textContent += '   Is Minor: ' + (member.is_minor ? 'Yes' : 'No') + '\n\n'
      })
    }
    
    // Pets
    if (profileData.pets && profileData.pets.length > 0) {
      textContent += 'PETS\n'
      textContent += '----------\n'
      profileData.pets.forEach((pet, index) => {
        textContent += (index + 1) + '. ' + (pet.name || 'N/A') + ' (' + (pet.pet_type || 'N/A') + ')\n'
        textContent += '   Breed: ' + (pet.breed || 'N/A') + '\n'
        textContent += '   Color: ' + (pet.color || 'N/A') + '\n'
        textContent += '   Weight: ' + (pet.weight || 'N/A') + '\n'
        textContent += '   Microchip: ' + (pet.microchip_number || 'N/A') + '\n\n'
      })
    }
    
    // Vehicles
    if (profileData.vehicles && profileData.vehicles.length > 0) {
      textContent += 'VEHICLES\n'
      textContent += '----------\n'
      profileData.vehicles.forEach((vehicle, index) => {
        textContent += (index + 1) + '. ' + (vehicle.year || '') + ' ' + (vehicle.make || '') + ' ' + (vehicle.model || '') + '\n'
        textContent += '   License Plate: ' + (vehicle.license_plate || 'N/A') + '\n'
        textContent += '   Color: ' + (vehicle.color || 'N/A') + '\n'
        textContent += '   Type: ' + (vehicle.vehicle_type || 'N/A') + '\n'
        textContent += '   Primary Vehicle: ' + (vehicle.is_primary ? 'Yes' : 'No') + '\n\n'
      })
    }
    
    // Create and download the file
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'HOA_Profile_Data_' + new Date().toISOString().split('T')[0] + '.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('✅ Profile data exported as text file successfully')
    return profileData
  } catch (error) {
    console.error('❌ Export profile data error:', error)
    throw error
  }
}

export default {
  getBasicProfile,
  updateBasicProfile,
  getResidenceInfo,
  updateResidenceInfo,
  getEmergencyInfo,
  updateEmergencyInfo,
  getPrivacySettings,
  updatePrivacySettings,
  getFinancialInfo,
  updateFinancialInfo,
  getNotificationSettings,
  updateNotificationSettings,
  getSystemPreferences,
  updateSystemPreferences,
  getCompleteProfile,
  getHouseholdMembers,
  createHouseholdMember,
  getHouseholdMember,
  updateHouseholdMember,
  deleteHouseholdMember,
  getPets,
  createPet,
  updatePet,
  deletePet,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changePassword,
  requestEmailVerification,
  verifyEmail,
  requestPhoneVerification,
  verifyPhone,
  getCompletionStatus,
  getChangeLogs,
  exportProfileData,
  exportProfileDataAsText,
}