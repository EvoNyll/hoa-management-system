// File: frontend/src/components/profile/SecuritySection.jsx
// Location: frontend/src/components/profile/SecuritySection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Lock, Eye, EyeOff, Shield, Mail, Phone, Save, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

const SecuritySection = () => {
  const { profileData, loading, changePassword, requestEmailVerification, requestPhoneVerification } = useProfile();
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [emailVerification, setEmailVerification] = useState({ new_email: '' });
  const [phoneVerification, setPhoneVerification] = useState({ new_phone: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState({
    password: false,
    email: false,
    phone: false
  });
  const [successMessages, setSuccessMessages] = useState({});
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(prev => ({ ...prev, password: true }));
    setSuccessMessages(prev => ({ ...prev, password: '' }));

    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      setSuccessMessages(prev => ({ ...prev, password: 'Password changed successfully!' }));
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, password: '' })), 3000);
    } catch (err) {
      setErrors({ password: err.message || 'Failed to change password' });
    } finally {
      setIsSubmitting(prev => ({ ...prev, password: false }));
    }
  };

  const handleEmailVerificationRequest = async (e) => {
    e.preventDefault();
    
    if (!emailVerification.new_email) {
      setErrors({ email: 'Email address is required' });
      return;
    }

    setIsSubmitting(prev => ({ ...prev, email: true }));

    try {
      await requestEmailVerification(emailVerification.new_email);
      setSuccessMessages(prev => ({ ...prev, email: 'Verification email sent!' }));
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, email: '' })), 3000);
    } catch (err) {
      setErrors({ email: err.message || 'Failed to send verification email' });
    } finally {
      setIsSubmitting(prev => ({ ...prev, email: false }));
    }
  };

  const handlePhoneVerificationRequest = async (e) => {
    e.preventDefault();
    
    if (!phoneVerification.new_phone) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    setIsSubmitting(prev => ({ ...prev, phone: true }));

    try {
      await requestPhoneVerification(phoneVerification.new_phone);
      setSuccessMessages(prev => ({ ...prev, phone: 'Verification code sent!' }));
      setTimeout(() => setSuccessMessages(prev => ({ ...prev, phone: '' })), 3000);
    } catch (err) {
      setErrors({ phone: err.message || 'Failed to send verification code' });
    } finally {
      setIsSubmitting(prev => ({ ...prev, phone: false }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        
        {successMessages.password && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{successMessages.password}</p>
            </div>
          </div>
        )}

        {errors.password && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{errors.password}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.current_password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.current_password && <p className="text-xs text-red-600 mt-1">{errors.current_password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.new_password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.new_password && <p className="text-xs text-red-600 mt-1">{errors.new_password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirm_password && <p className="text-xs text-red-600 mt-1">{errors.confirm_password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting.password}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting.password ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            {isSubmitting.password ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Email Verification Section */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Verification</h3>
        
        {successMessages.email && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{successMessages.email}</p>
            </div>
          </div>
        )}

        {errors.email && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{errors.email}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Current email: <strong>{profileData.basic?.email}</strong>
        </p>

        <form onSubmit={handleEmailVerificationRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Email Address
            </label>
            <input
              type="email"
              value={emailVerification.new_email}
              onChange={(e) => setEmailVerification({ new_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new email address"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting.email}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting.email ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {isSubmitting.email ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>
      </div>

      {/* Phone Verification Section */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Verification</h3>
        
        {successMessages.phone && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{successMessages.phone}</p>
            </div>
          </div>
        )}

        {errors.phone && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{errors.phone}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Current phone: <strong>{profileData.basic?.phone || 'Not set'}</strong>
        </p>

        <form onSubmit={handlePhoneVerificationRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Phone Number
            </label>
            <input
              type="tel"
              value={phoneVerification.new_phone}
              onChange={(e) => setPhoneVerification({ new_phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting.phone}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting.phone ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Phone className="w-4 h-4 mr-2" />
            )}
            {isSubmitting.phone ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Shield className="w-5 h-5 text-blue-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Security Tips</h4>
            <ul className="mt-1 text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Use a strong password with at least 8 characters</li>
              <li>Include uppercase, lowercase, numbers, and special characters</li>
              <li>Don't reuse passwords from other accounts</li>
              <li>Verify your email and phone for account recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;