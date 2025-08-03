import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Lock, Save, Loader, CheckCircle, Shield, Key } from 'lucide-react';

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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (passwordData.new_password && passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Change password error:', error);
      setErrors({ general: 'Failed to update password. Please check your current password and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <span className="text-red-800">{errors.general}</span>
        </div>
      )}

      {/* Password Change */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-medium text-gray-900">Change Password</h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.current_password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.new_password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-medium text-gray-900">Account Security</h4>
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
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;