// File: frontend/src/services/profileService.js
// Location: frontend/src/services/profileService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const createHeaders = (token, isFormData = false) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Basic Profile Management
export const getBasicProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/basic/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateBasicProfile = async (token, data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'profile_photo' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  const response = await fetch(`${API_BASE_URL}/users/profile/basic/`, {
    method: 'PUT',
    headers: createHeaders(token, true),
    body: formData,
  });
  return handleResponse(response);
};

// Residence Information
export const getResidenceInfo = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/residence/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateResidenceInfo = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/residence/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Emergency Information
export const getEmergencyInfo = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/emergency/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateEmergencyInfo = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/emergency/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Privacy Settings
export const getPrivacySettings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/privacy/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updatePrivacySettings = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/privacy/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Financial Information
export const getFinancialInfo = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/financial/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateFinancialInfo = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/financial/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Notification Settings
export const getNotificationSettings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/notifications/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateNotificationSettings = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/notifications/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// System Preferences
export const getSystemPreferences = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/system/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateSystemPreferences = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/system/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Complete Profile
export const getCompleteProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/complete/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

// Household Members
export const getHouseholdMembers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/household-members/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const createHouseholdMember = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/household-members/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getHouseholdMember = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/household-members/${id}/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateHouseholdMember = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/users/household-members/${id}/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteHouseholdMember = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/household-members/${id}/`, {
    method: 'DELETE',
    headers: createHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// Pets
export const getPets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/pets/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const createPet = async (token, data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'photo' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  const response = await fetch(`${API_BASE_URL}/users/pets/`, {
    method: 'POST',
    headers: createHeaders(token, true),
    body: formData,
  });
  return handleResponse(response);
};

export const getPet = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/pets/${id}/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updatePet = async (token, id, data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'photo' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  const response = await fetch(`${API_BASE_URL}/users/pets/${id}/`, {
    method: 'PUT',
    headers: createHeaders(token, true),
    body: formData,
  });
  return handleResponse(response);
};

export const deletePet = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/pets/${id}/`, {
    method: 'DELETE',
    headers: createHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// Vehicles
export const getVehicles = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/vehicles/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const createVehicle = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/vehicles/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getVehicle = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/vehicles/${id}/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const updateVehicle = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/users/vehicles/${id}/`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteVehicle = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/users/vehicles/${id}/`, {
    method: 'DELETE',
    headers: createHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// Security Actions
export const changePassword = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/security/change-password/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const requestEmailVerification = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/security/request-email-verification/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const verifyEmail = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/security/verify-email/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const requestPhoneVerification = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/security/request-phone-verification/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const verifyPhone = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/users/security/verify-phone/`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Utility Functions
export const getCompletionStatus = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/completion-status/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const getChangeLogs = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/change-logs/`, {
    headers: createHeaders(token),
  });
  return handleResponse(response);
};

export const exportProfileData = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/export-data/`, {
    method: 'POST',
    headers: createHeaders(token),
  });
  return handleResponse(response);
};