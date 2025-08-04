import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Lock, Save, Loader, CheckCircle, Shield, Key, AlertTriangle } from 'lucide-react';

const SecuritySection = () => {
  const { profileData, loading, updateSecuritySettings, changePassword } = useProfile();
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: null }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.current_password.trim()) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!passwordData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else {
      // Password strength validation
      if (passwordData.new_password.length < 8) {
        newErrors.new_password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(passwordData.new_password)) {
        newErrors.new_password = 'Password must contain both uppercase and lowercase letters';
      } else if (!/(?=.*\d)/.test(passwordData.new_password)) {
        newErrors.new_password = 'Password must contain at least one number';
      }
    }
    
    if (!passwordData.confirm_password.trim()) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    // Check if new password is same as current
    if (passwordData.current_password === passwordData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔐 Password change initiated');
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('❌ Password validation failed:', validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      console.log('📤 Sending password change request...');
      
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      console.log('✅ Password changed successfully');
      
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('❌ Password change error:', error);
      
      // Handle specific error messages
      if (error.message) {
        if (error.message.includes('Current password is incorrect')) {
          setErrors({ current_password: 'Current password is incorrect' });
        } else if (error.message.includes('Authentication failed')) {
          setErrors({ general: 'Authentication failed. Please log in again.' });
        } else if (error.message.includes('Network error')) {
          setErrors({ general: 'Network error. Please check your connection and try again.' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'Failed to update password. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Lock className="w-5 h-5 text-red-600 mr-2" />
            Security Settings
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account security and password settings.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <div className="text-sm text-green-700">
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <div className="text-sm text-red-700">
                <p className="font-medium">{errors.general}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-medium text-gray-900">Change Password</h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.current_password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.new_password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-medium text-gray-900">Account Security Status</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-md border">
            <div>
              <p className="font-medium text-gray-900">Email Verification</p>
              <p className="text-sm text-gray-600">Verify your email address for account security</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-md border">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
            >
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-md border">
            <div>
              <p className="font-medium text-gray-900">Login Activity</p>
              <p className="text-sm text-gray-600">Review recent login attempts and devices</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              View Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;