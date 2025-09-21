import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Shield, Eye, Users, Save, Loader, CheckCircle, Info } from 'lucide-react';

const PrivacySection = () => {
  const { profileData, loading, updatePrivacySettings } = useProfile();
  const [formData, setFormData] = useState({
    is_directory_visible: false,
    directory_show_name: true,
    directory_show_unit: true,
    directory_show_phone: false,
    directory_show_email: false,
    directory_show_household: false,
    profile_visibility: 'residents_only', // Fixed: Use backend values
    ...profileData.privacy
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (profileData.privacy) {
      setFormData(prev => ({
        ...prev,
        ...profileData.privacy
      }));
    }
  }, [profileData.privacy]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      console.log('📤 Sending privacy settings:', formData);
      await updatePrivacySettings(formData);
      setSuccessMessage('Privacy settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Privacy settings update error:', err);
      
      // Handle specific error responses
      if (err.response?.data) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          setErrors(backendErrors);
        } else {
          setErrors({ submit: 'Failed to update privacy settings. Please try again.' });
        }
      } else {
        setErrors({ submit: err.message || 'Failed to update privacy settings' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fixed: Use correct backend values for profile_visibility
  const profileVisibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to all community members and guests' },
    { value: 'residents_only', label: 'Residents Only', description: 'Visible only to registered residents' },
    { value: 'private', label: 'Private', description: 'Visible only to HOA administration' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
        </div>
      )}

      {/* Field-specific errors */}
      {Object.keys(errors).filter(key => key !== 'submit').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Please correct the following:</h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {Object.entries(errors).filter(([key]) => key !== 'submit').map(([field, message]) => (
              <li key={field}>• {field.replace('_', ' ')}: {Array.isArray(message) ? message[0] : message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Directory Visibility */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Community Directory</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <label htmlFor="is_directory_visible" className="relative inline-flex items-center cursor-pointer">
              <input
                id="is_directory_visible"
                name="is_directory_visible"
                type="checkbox"
                checked={formData.is_directory_visible}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
            </label>
            <div className="ml-3">
              <label htmlFor="is_directory_visible" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                Include me in the community directory
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allow other residents to find your contact information in the community directory
              </p>
            </div>
          </div>

          {formData.is_directory_visible && (
            <div className="ml-7 space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Show in directory:</p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="directory_show_name" className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="directory_show_name"
                      name="directory_show_name"
                      type="checkbox"
                      checked={formData.directory_show_name}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                  <label htmlFor="directory_show_name" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Full Name
                  </label>
                </div>

                <div className="flex items-center">
                  <label htmlFor="directory_show_unit" className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="directory_show_unit"
                      name="directory_show_unit"
                      type="checkbox"
                      checked={formData.directory_show_unit}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                  <label htmlFor="directory_show_unit" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Unit Number
                  </label>
                </div>

                <div className="flex items-center">
                  <label htmlFor="directory_show_phone" className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="directory_show_phone"
                      name="directory_show_phone"
                      type="checkbox"
                      checked={formData.directory_show_phone}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                  <label htmlFor="directory_show_phone" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Phone Number
                  </label>
                </div>

                <div className="flex items-center">
                  <label htmlFor="directory_show_email" className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="directory_show_email"
                      name="directory_show_email"
                      type="checkbox"
                      checked={formData.directory_show_email}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                  <label htmlFor="directory_show_email" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Email Address
                  </label>
                </div>

                <div className="flex items-center">
                  <label htmlFor="directory_show_household" className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="directory_show_household"
                      name="directory_show_household"
                      type="checkbox"
                      checked={formData.directory_show_household}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                  <label htmlFor="directory_show_household" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Household Members
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center mb-4">
          <Eye className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Visibility</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Control who can view your detailed profile information beyond the directory listing.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {profileVisibilityOptions.map((option) => (
              <div key={option.value} className="relative">
                <input
                  id={`visibility_${option.value}`}
                  name="profile_visibility"
                  type="radio"
                  value={option.value}
                  checked={formData.profile_visibility === option.value}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`visibility_${option.value}`}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.profile_visibility === option.value
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.profile_visibility === option.value
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {formData.profile_visibility === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${
                        formData.profile_visibility === option.value
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.label}
                      </div>
                      <p className={`text-xs mt-1 ${
                        formData.profile_visibility === option.value
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Information */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data Privacy Rights</h3>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <Info className="w-5 h-5 text-blue-400 dark:text-blue-400 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Your Privacy Rights</h4>
              <ul className="mt-1 text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• You can update these settings at any time</li>
                <li>• Emergency contact information is always accessible to HOA staff for safety</li>
                <li>• Financial information is never shared in the directory</li>
                <li>• You can request to download or delete your data at any time</li>
                <li>• Directory information is only visible to other community members</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Data Usage Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium">Always Private:</p>
              <ul className="mt-1 space-y-1">
                <li>• Payment information</li>
                <li>• Medical conditions</li>
                <li>• Emergency contacts (except to staff)</li>
                <li>• Login credentials</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Controlled by Settings:</p>
              <ul className="mt-1 space-y-1">
                <li>• Directory listing</li>
                <li>• Contact information</li>
                <li>• Household members</li>
                <li>• Profile visibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">Quick Privacy Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                is_directory_visible: false,
                profile_visibility: 'private'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
            >
              Maximum Privacy
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                is_directory_visible: true,
                directory_show_name: true,
                directory_show_unit: true,
                directory_show_phone: false,
                directory_show_email: false,
                directory_show_household: false,
                profile_visibility: 'residents_only'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
            >
              Recommended Settings
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                is_directory_visible: true,
                directory_show_name: true,
                directory_show_unit: true,
                directory_show_phone: true,
                directory_show_email: true,
                directory_show_household: true,
                profile_visibility: 'public'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
            >
              Full Community Sharing
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Privacy Settings'}
        </button>
      </div>
    </form>
  );
};

export default PrivacySection;