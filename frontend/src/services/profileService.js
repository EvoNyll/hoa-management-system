// frontend/src/services/profileService.js - FIXED VERSION
import api from './api'

// Basic Profile Management
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

// Residence Information
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

// Emergency Information
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

// Privacy Settings
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

// Security Settings - FIXED URLs
export const getSecuritySettings = async () => {
  try {
    const response = await api.get('/users/profile/security/')
    return response.data
  } catch (error) {
    console.error('Get security settings error:', error)
    throw error
  }
}

export const updateSecuritySettings = async (data) => {
  try {
    const response = await api.put('/users/profile/security/', data)
    return response.data
  } catch (error) {
    console.error('Update security settings error:', error)
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

// Financial Information
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

// Notification Settings
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

// System Preferences
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

// Household Members - FIXED URLs
export const getHouseholdMembers = async () => {
  try {
    const response = await api.get('/users/household-members/')
    return response.data
  } catch (error) {
    console.error('Get household members error:', error)
    throw error
  }
}

export const addHouseholdMember = async (data) => {
  try {
    const response = await api.post('/users/household-members/', data)
    return response.data
  } catch (error) {
    console.error('Add household member error:', error)
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
    const response = await api.delete(`/users/household-members/${id}/`)
    return response.data
  } catch (error) {
    console.error('Delete household member error:', error)
    throw error
  }
}

// Pets - FIXED URLs
export const getPets = async () => {
  try {
    const response = await api.get('/users/pets/')
    return response.data
  } catch (error) {
    console.error('Get pets error:', error)
    throw error
  }
}

export const addPet = async (data) => {
  try {
    console.log('🔄 Adding pet:', data instanceof FormData ? 'FormData' : data);
    
    let response;
    
    if (data instanceof FormData) {
      // For file uploads, use FormData
      response = await api.post('/users/pets/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // For regular data, use JSON
      response = await api.post('/users/pets/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    console.log('✅ Pet added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Add pet error:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePet = async (id, data) => {
  try {
    console.log('🔄 Updating pet:', id, data instanceof FormData ? 'FormData' : data);
    
    let response;
    
    if (data instanceof FormData) {
      // For file uploads, use FormData
      response = await api.put(`/users/pets/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // For regular data, use JSON
      response = await api.put(`/users/pets/${id}/`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    console.log('✅ Pet updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update pet error:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePet = async (id) => {
  try {
    const response = await api.delete(`/users/pets/${id}/`)
    return response.data
  } catch (error) {
    console.error('Delete pet error:', error)
    throw error
  }
}

// Vehicles - FIXED URLs
export const getVehicles = async () => {
  try {
    const response = await api.get('/users/vehicles/')
    return response.data
  } catch (error) {
    console.error('Get vehicles error:', error)
    throw error
  }
}

export const addVehicle = async (data) => {
  try {
    const response = await api.post('/users/vehicles/', data)
    return response.data
  } catch (error) {
    console.error('Add vehicle error:', error)
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
    const response = await api.delete(`/users/vehicles/${id}/`)
    return response.data
  } catch (error) {
    console.error('Delete vehicle error:', error)
    throw error
  }
}

// Completion Status and Logs
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

// Export Functions
export const exportProfileData = async () => {
  try {
    console.log('📊 Exporting profile data as CSV...')
    const response = await api.post('/users/profile/export-data/')
    
    const profileData = response.data
    
    // Create comprehensive CSV content
    let csvContent = ''
    
    // Header
    csvContent += 'HOA RESIDENT PROFILE DATA\n'
    csvContent += 'Generated: ' + new Date().toLocaleString() + '\n'
    csvContent += '='.repeat(50) + '\n\n'
    
    // Basic Information
    if (profileData.basic_info) {
      csvContent += 'BASIC INFORMATION\n'
      csvContent += 'Field,Value\n'
      csvContent += '"Full Name","' + (profileData.basic_info.full_name || '') + '"\n'
      csvContent += '"Email","' + (profileData.basic_info.email || '') + '"\n'
      csvContent += '"Phone","' + (profileData.basic_info.phone || '') + '"\n'
      csvContent += '"Role","' + (profileData.basic_info.role || '') + '"\n'
      csvContent += '"Unit Number","' + (profileData.basic_info.unit_number || '') + '"\n'
      csvContent += '"Move-in Date","' + (profileData.basic_info.move_in_date || '') + '"\n'
      csvContent += '"Property Type","' + (profileData.basic_info.property_type || '') + '"\n'
      csvContent += '"Emergency Contact","' + (profileData.basic_info.emergency_contact || '') + '"\n'
      csvContent += '"Emergency Phone","' + (profileData.basic_info.emergency_phone || '') + '"\n'
      csvContent += '"Medical Conditions","' + (profileData.basic_info.medical_conditions || '') + '"\n'
      csvContent += '\n'
    }
    
    // Household Members
    if (profileData.household_members && profileData.household_members.length > 0) {
      csvContent += 'HOUSEHOLD MEMBERS\n'
      csvContent += 'Name,Relationship,Date of Birth,Contact Phone,Emergency Contact\n'
      profileData.household_members.forEach(member => {
        csvContent += '"' + (member.full_name || '') + '","' + (member.relationship || '') + '","' + (member.date_of_birth || '') + '","' + (member.contact_phone || '') + '","' + (member.is_emergency_contact ? 'Yes' : 'No') + '"\n'
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