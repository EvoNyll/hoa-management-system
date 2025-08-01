// File: frontend/src/context/ProfileContext.jsx
// Location: frontend/src/context/ProfileContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as profileService from '../services/profileService';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState({
    basic: null,
    residence: null,
    emergency: null,
    privacy: null,
    financial: null,
    notifications: null,
    system: null,
    householdMembers: [],
    pets: [],
    vehicles: [],
    changeLogs: [],
    completionStatus: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data when user is authenticated
  useEffect(() => {
    if (user && token) {
      loadProfileData();
    }
  }, [user, token]);

  const loadProfileData = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [
        basic,
        residence,
        emergency,
        privacy,
        financial,
        notifications,
        system,
        householdMembers,
        pets,
        vehicles,
        completionStatus
      ] = await Promise.all([
        profileService.getBasicProfile(token),
        profileService.getResidenceInfo(token),
        profileService.getEmergencyInfo(token),
        profileService.getPrivacySettings(token),
        profileService.getFinancialInfo(token),
        profileService.getNotificationSettings(token),
        profileService.getSystemPreferences(token),
        profileService.getHouseholdMembers(token),
        profileService.getPets(token),
        profileService.getVehicles(token),
        profileService.getCompletionStatus(token)
      ]);

      setProfileData({
        basic,
        residence,
        emergency,
        privacy,
        financial,
        notifications,
        system,
        householdMembers,
        pets,
        vehicles,
        changeLogs: [],
        completionStatus
      });
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateBasicProfile = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateBasicProfile(token, data);
      setProfileData(prev => ({ ...prev, basic: updated }));
      
      // Reload completion status
      const completionStatus = await profileService.getCompletionStatus(token);
      setProfileData(prev => ({ ...prev, completionStatus }));
      
      return updated;
    } catch (err) {
      console.error('Failed to update basic profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResidenceInfo = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateResidenceInfo(token, data);
      setProfileData(prev => ({ ...prev, residence: updated }));
      
      const completionStatus = await profileService.getCompletionStatus(token);
      setProfileData(prev => ({ ...prev, completionStatus }));
      
      return updated;
    } catch (err) {
      console.error('Failed to update residence info:', err);
      setError('Failed to update residence information');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmergencyInfo = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateEmergencyInfo(token, data);
      setProfileData(prev => ({ ...prev, emergency: updated }));
      
      const completionStatus = await profileService.getCompletionStatus(token);
      setProfileData(prev => ({ ...prev, completionStatus }));
      
      return updated;
    } catch (err) {
      console.error('Failed to update emergency info:', err);
      setError('Failed to update emergency information');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updatePrivacySettings(token, data);
      setProfileData(prev => ({ ...prev, privacy: updated }));
      return updated;
    } catch (err) {
      console.error('Failed to update privacy settings:', err);
      setError('Failed to update privacy settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFinancialInfo = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateFinancialInfo(token, data);
      setProfileData(prev => ({ ...prev, financial: updated }));
      return updated;
    } catch (err) {
      console.error('Failed to update financial info:', err);
      setError('Failed to update financial information');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateNotificationSettings(token, data);
      setProfileData(prev => ({ ...prev, notifications: updated }));
      return updated;
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setError('Failed to update notification settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSystemPreferences = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateSystemPreferences(token, data);
      setProfileData(prev => ({ ...prev, system: updated }));
      return updated;
    } catch (err) {
      console.error('Failed to update system preferences:', err);
      setError('Failed to update system preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Household Members
  const addHouseholdMember = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const newMember = await profileService.createHouseholdMember(token, data);
      setProfileData(prev => ({
        ...prev,
        householdMembers: [...prev.householdMembers, newMember]
      }));
      
      const completionStatus = await profileService.getCompletionStatus(token);
      setProfileData(prev => ({ ...prev, completionStatus }));
      
      return newMember;
    } catch (err) {
      console.error('Failed to add household member:', err);
      setError('Failed to add household member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHouseholdMember = async (id, data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateHouseholdMember(token, id, data);
      setProfileData(prev => ({
        ...prev,
        householdMembers: prev.householdMembers.map(member =>
          member.id === id ? updated : member
        )
      }));
      return updated;
    } catch (err) {
      console.error('Failed to update household member:', err);
      setError('Failed to update household member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHouseholdMember = async (id) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.deleteHouseholdMember(token, id);
      setProfileData(prev => ({
        ...prev,
        householdMembers: prev.householdMembers.filter(member => member.id !== id)
      }));
      
      const completionStatus = await profileService.getCompletionStatus(token);
      setProfileData(prev => ({ ...prev, completionStatus }));
    } catch (err) {
      console.error('Failed to delete household member:', err);
      setError('Failed to delete household member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Pets
  const addPet = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const newPet = await profileService.createPet(token, data);
      setProfileData(prev => ({
        ...prev,
        pets: [...prev.pets, newPet]
      }));
      return newPet;
    } catch (err) {
      console.error('Failed to add pet:', err);
      setError('Failed to add pet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (id, data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updatePet(token, id, data);
      setProfileData(prev => ({
        ...prev,
        pets: prev.pets.map(pet => pet.id === id ? updated : pet)
      }));
      return updated;
    } catch (err) {
      console.error('Failed to update pet:', err);
      setError('Failed to update pet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.deletePet(token, id);
      setProfileData(prev => ({
        ...prev,
        pets: prev.pets.filter(pet => pet.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete pet:', err);
      setError('Failed to delete pet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vehicles
  const addVehicle = async (data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const newVehicle = await profileService.createVehicle(token, data);
      setProfileData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, newVehicle]
      }));
      return newVehicle;
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      setError('Failed to add vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (id, data) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const updated = await profileService.updateVehicle(token, id, data);
      setProfileData(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(vehicle => vehicle.id === id ? updated : vehicle)
      }));
      return updated;
    } catch (err) {
      console.error('Failed to update vehicle:', err);
      setError('Failed to update vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.deleteVehicle(token, id);
      setProfileData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      setError('Failed to delete vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Security actions
  const changePassword = async (currentPassword, newPassword) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: newPassword
      });
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestEmailVerification = async (newEmail) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.requestEmailVerification(token, { new_email: newEmail });
    } catch (err) {
      console.error('Failed to request email verification:', err);
      setError('Failed to request email verification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (verificationToken) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.verifyEmail(token, { token: verificationToken });
      // Reload basic profile to get updated email
      await loadProfileData();
    } catch (err) {
      console.error('Failed to verify email:', err);
      setError('Failed to verify email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPhoneVerification = async (newPhone) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.requestPhoneVerification(token, { new_phone: newPhone });
    } catch (err) {
      console.error('Failed to request phone verification:', err);
      setError('Failed to request phone verification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (verificationCode) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.verifyPhone(token, { code: verificationCode });
      // Reload basic profile to get updated phone
      await loadProfileData();
    } catch (err) {
      console.error('Failed to verify phone:', err);
      setError('Failed to verify phone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportProfileData = async () => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await profileService.exportProfileData(token);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return data;
    } catch (err) {
      console.error('Failed to export profile data:', err);
      setError('Failed to export profile data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadChangeLogs = async () => {
    if (!token) return;
    
    try {
      const changeLogs = await profileService.getChangeLogs(token);
      setProfileData(prev => ({ ...prev, changeLogs }));
      return changeLogs;
    } catch (err) {
      console.error('Failed to load change logs:', err);
      setError('Failed to load change logs');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = {
    // State
    profileData,
    loading,
    error,
    
    // Actions
    loadProfileData,
    clearError,
    
    // Profile sections
    updateBasicProfile,
    updateResidenceInfo,
    updateEmergencyInfo,
    updatePrivacySettings,
    updateFinancialInfo,
    updateNotificationSettings,
    updateSystemPreferences,
    
    // Household members
    addHouseholdMember,
    updateHouseholdMember,
    deleteHouseholdMember,
    
    // Pets
    addPet,
    updatePet,
    deletePet,
    
    // Vehicles
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Security
    changePassword,
    requestEmailVerification,
    verifyEmail,
    requestPhoneVerification,
    verifyPhone,
    
    // Utilities
    exportProfileData,
    loadChangeLogs
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};