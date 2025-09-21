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
    console.log('🔄 Updating residence info with data:', data);

    if (data instanceof FormData) {
      console.log('📤 Sending FormData with residence info');
      console.log('📤 FormData entries:');
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // Use fetch API directly for file uploads to avoid Axios header conflicts
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/residence/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set multipart/form-data with boundary
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(`Request failed with status code ${response.status}`);
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      const responseData = await response.json();
      console.log('✅ Residence update response:', responseData);
      return responseData;

    } else {
      // For regular JSON data, use the existing Axios approach
      const cleanData = {};

      if (data.block) {
        cleanData.block = data.block;
      }

      if (data.lot) {
        cleanData.lot = data.lot;
      }

      if (data.house_front_view) {
        cleanData.house_front_view = data.house_front_view;
      }

      console.log('📤 Clean data being sent:', cleanData);

      const response = await api.put('/users/profile/residence/', cleanData);

      console.log('✅ Residence update response:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Update residence info error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url || 'fetch request'
    });

    // Provide more specific error information
    if (error.response?.status === 400) {
      console.error('📋 Validation errors:', error.response.data);
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication error - token may be expired');
    } else if (error.response?.status === 500) {
      console.error('🚨 Server error');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - backend may be down');
    }

    throw error;
  }
};

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

// Security Settings
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

// Password Change (separate endpoint)
export const changePassword = async (data) => {
  try {
    console.log('🔄 Changing password...');
    
    // Backend expects current_password, new_password, and confirm_password
    const requestData = {
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.new_password  // Same as new_password since we validate on frontend
    };
    
    console.log('📤 Sending password change data:', {
      ...requestData,
      current_password: '[HIDDEN]',
      new_password: '[HIDDEN]',
      confirm_password: '[HIDDEN]'
    });
    
    const response = await api.post('/users/security/change-password/', requestData);
    console.log('✅ Password changed successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Change password error:', error);
    
    // Provide more specific error information
    if (error.response?.status === 400) {
      console.error('📋 Password validation errors:', error.response.data);
      // Handle specific validation errors
      if (error.response.data.current_password) {
        throw new Error('Current password is incorrect');
      }
      if (error.response.data.new_password) {
        throw new Error(error.response.data.new_password[0] || 'New password is invalid');
      }
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed - please log in again');
    } else if (error.response?.status === 500) {
      throw new Error('Server error - please try again later');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - please check your connection');
    }
    
    throw error;
  }
};

// Email Verification
export const requestEmailVerification = async (newEmail) => {
  try {
    console.log('📧 Requesting email verification for:', newEmail);
    const response = await api.post('/users/security/request-email-verification/', {
      new_email: newEmail
    });
    console.log('✅ Email verification request sent');
    return response.data;
  } catch (error) {
    console.error('❌ Email verification request error:', error);
    
    // If the endpoint doesn't exist or email is not configured, provide mock response
    if (error.response?.status === 404 || error.response?.status === 500) {
      console.log('📧 Using mock email verification');
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        message: 'Mock verification email sent! (Email not configured in development)',
        email: newEmail,
        note: 'In production, configure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in settings'
      };
    }
    
    if (error.response?.status === 400) {
      if (error.response.data.new_email) {
        throw new Error(error.response.data.new_email[0] || 'Invalid email address');
      }
    }
    
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    console.log('✉️ Verifying email with token');
    const response = await api.post('/users/security/verify-email/', {
      token: token
    });
    console.log('✅ Email verified successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Email verification error:', error);
    
    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Email verification failed';
      throw new Error(errorMsg);
    }
    
    throw error;
  }
};

// Two-Factor Authentication - Setup TOTP
export const setupTwoFactor = async () => {
  try {
    console.log('🔐 Setting up two-factor authentication');
    const response = await api.post('/users/security/2fa/setup/');
    console.log('✅ 2FA setup initiated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Setup 2FA error:', error);

    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Failed to setup two-factor authentication';
      throw new Error(errorMsg);
    }

    throw error;
  }
};

// Verify TOTP setup
export const verifyTotpSetup = async (secret, code) => {
  try {
    console.log('🔐 Verifying TOTP setup');
    const response = await api.post('/users/security/2fa/verify-setup/', { secret, code });
    console.log('✅ TOTP setup verified successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Verify TOTP setup error:', error);

    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Failed to verify TOTP setup';
      throw new Error(errorMsg);
    }

    throw error;
  }
};

// Disable Two-Factor Authentication
export const disableTwoFactor = async (password) => {
  try {
    console.log('🔐 Disabling two-factor authentication');
    const response = await api.post('/users/security/2fa/disable/', { password });
    console.log('✅ 2FA disabled successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Disable 2FA error:', error);

    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Failed to disable two-factor authentication';
      throw new Error(errorMsg);
    }

    throw error;
  }
};

// Generate backup codes
export const generateBackupCodes = async () => {
  try {
    console.log('🎫 Generating backup codes');
    const response = await api.post('/users/security/2fa/backup-codes/');
    console.log('✅ Backup codes generated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Generate backup codes error:', error);

    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Failed to generate backup codes';
      throw new Error(errorMsg);
    }

    throw error;
  }
};

// Verify TOTP code
export const verifyTotpCode = async (token) => {
  try {
    console.log('🔐 Verifying TOTP code');
    const response = await api.post('/users/security/2fa/verify/', { token });
    console.log('✅ TOTP code verified successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Verify TOTP code error:', error);

    if (error.response?.status === 400) {
      const errorMsg = error.response.data.error || 'Invalid TOTP code';
      throw new Error(errorMsg);
    }

    throw error;
  }
};

// Legacy function for backward compatibility
export const updateTwoFactorSetting = async (enabled) => {
  if (enabled) {
    return setupTwoFactor();
  } else {
    return disableTwoFactor();
  }
};

// Legacy function for backward compatibility
export const generateMockBackupCodes = () => {
  console.log('🎫 Using legacy backup codes - redirecting to real implementation');
  return generateBackupCodes();
};

// Login Activity (using existing change logs endpoint)
export const getLoginActivity = async () => {
  try {
    console.log('📊 Fetching login activity from change logs');
    const response = await api.get('/users/profile/change-logs/');
    console.log('✅ Change logs fetched successfully');
    
    // Filter for login-related activities and format the data
    const allLogs = response.data || [];
    const loginLogs = allLogs.filter(log => 
      log.change_type === 'login' || 
      log.field_name === 'login' ||
      log.field_name === 'logout'
    );
    
    // Format for display (simulate session data from change logs)
    const sessions = loginLogs.slice(0, 10).map((log, index) => ({
      id: log.id,
      device_name: extractDeviceName(log.user_agent),
      user_agent: log.user_agent,
      ip_address: log.ip_address || 'Unknown',
      location: getLocationFromIP(log.ip_address),
      created_at: log.timestamp,
      is_current: index === 0 && log.field_name === 'login', // Most recent login is current
      browser: extractBrowser(log.user_agent),
      activity_type: log.field_name === 'logout' ? 'Logged out' : 'Logged in'
    }));
    
    return { sessions: sessions };
  } catch (error) {
    console.error('❌ Get login activity error:', error);
    throw error;
  }
};

// Helper functions for parsing activity data
const extractDeviceName = (userAgent) => {
  if (!userAgent) return 'Unknown Device';
  
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows')) return 'Windows Computer';
  if (userAgent.includes('Macintosh')) return 'Mac Computer';
  if (userAgent.includes('Linux')) return 'Linux Computer';
  
  return 'Unknown Device';
};

const extractBrowser = (userAgent) => {
  if (!userAgent) return 'Unknown Browser';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'Unknown Browser';
};

const getLocationFromIP = (ipAddress) => {
  // In a real app, you'd use a geolocation service
  // For now, return a placeholder
  if (!ipAddress) return 'Unknown Location';
  
  // Mock location based on IP patterns (this is just for demo)
  if (ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.')) {
    return 'Local Network';
  }
  
  return 'Unknown Location';
};

// Mock session management (since real session endpoints don't exist)
export const terminateSession = async (sessionId) => {
  try {
    console.log('🚪 Mock: Terminating session', sessionId);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'Session terminated (mock)' };
  } catch (error) {
    throw error;
  }
};

export const terminateAllSessions = async () => {
  try {
    console.log('🚫 Mock: Terminating all sessions');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'All sessions terminated (mock)' };
  } catch (error) {
    throw error;
  }
};

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

// Household Members
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
    await api.delete(`/users/household-members/${id}/`)
    return { id }
  } catch (error) {
    console.error('Delete household member error:', error)
    throw error
  }
}

// Pets
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
    console.log('[SERVICE DEBUG] addPet called with data type:', data instanceof FormData ? 'FormData' : typeof data);

    if (data instanceof FormData) {
      // Use fetch API directly for file uploads to avoid Axios header conflicts
      console.log('[SERVICE DEBUG] Using fetch for FormData upload');
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/pets/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set multipart/form-data with boundary
        },
        body: data
      });

      console.log('[SERVICE DEBUG] FormData response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('[SERVICE DEBUG] FormData error response:', errorData);
        const error = new Error(`Request failed with status code ${response.status}`);
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      const responseData = await response.json();
      console.log('[SERVICE DEBUG] FormData success response:', responseData);
      return responseData;
    } else {
      // For regular JSON data, use the existing Axios approach
      console.log('[SERVICE DEBUG] Using axios for JSON upload');
      console.log('[SERVICE DEBUG] JSON data:', data);
      const response = await api.post('/users/pets/', data);
      console.log('[SERVICE DEBUG] JSON success response:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('[SERVICE DEBUG] Add pet error:', error)
    throw error
  }
}

export const updatePet = async (id, data) => {
  try {
    if (data instanceof FormData) {
      // Use fetch API directly for file uploads to avoid Axios header conflicts
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/pets/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set multipart/form-data with boundary
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(`Request failed with status code ${response.status}`);
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      const responseData = await response.json();
      return responseData;
    } else {
      // For regular JSON data, use the existing Axios approach
      const response = await api.put(`/users/pets/${id}/`, data);
      return response.data;
    }
  } catch (error) {
    console.error('Update pet error:', error)
    throw error
  }
}

export const deletePet = async (id) => {
  try {
    await api.delete(`/users/pets/${id}/`)
    return { id }
  } catch (error) {
    console.error('Delete pet error:', error)
    throw error
  }
}

// Vehicles
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
    await api.delete(`/users/vehicles/${id}/`)
    return { id }
  } catch (error) {
    console.error('Delete vehicle error:', error)
    throw error
  }
}

// Profile Utilities
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

// Export Profile Data
export const exportProfileData = async () => {
  try {
    console.log('📊 Exporting profile data...')
    
    // Gather all profile data
    const results = await Promise.allSettled([
      getBasicProfile(),
      getResidenceInfo(), 
      getEmergencyInfo(),
      getPrivacySettings(),
      getFinancialInfo(),
      getNotificationSettings(),
      getSystemPreferences(),
      getHouseholdMembers(),
      getPets(),
      getVehicles(),
      getChangeLogs()
    ])
    
    const profileData = {
      basic_info: results[0].status === 'fulfilled' ? results[0].value : {},
      residence_info: results[1].status === 'fulfilled' ? results[1].value : {},
      emergency_info: results[2].status === 'fulfilled' ? results[2].value : {},
      privacy_settings: results[3].status === 'fulfilled' ? results[3].value : {},
      financial_info: results[4].status === 'fulfilled' ? results[4].value : {},
      notification_settings: results[5].status === 'fulfilled' ? results[5].value : {},
      system_preferences: results[6].status === 'fulfilled' ? results[6].value : {},
      household_members: results[7].status === 'fulfilled' ? results[7].value : [],
      pets: results[8].status === 'fulfilled' ? results[8].value : [],
      vehicles: results[9].status === 'fulfilled' ? results[9].value : [],
      change_logs: results[10].status === 'fulfilled' ? results[10].value : []
    }
    
    // Create CSV content
    let csvContent = 'HOA PORTAL - PROFILE DATA EXPORT\n'
    csvContent += 'Generated: ' + new Date().toLocaleString() + '\n\n'
    
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