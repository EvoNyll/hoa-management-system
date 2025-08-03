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
    profile_visibility: 'members',
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

    try {
      await updatePrivacySettings(formData);
      setSuccessMessage('Privacy settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update privacy settings' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileVisibilityOptions = [
    { value: 'all', label: 'All Residents', description: 'Visible to all community members' },
    { value: 'members', label: 'Members Only', description: 'Visible only to registered members' },
    { value: 'admin', label: 'Admin Only', description: 'Visible only to HOA administration' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Directory Visibility */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Community Directory</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="is_directory_visible"
                name="is_directory_visible"
                type="checkbox"
                checked={formData.is_directory_visible}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="is_directory_visible" className="text-sm font-medium text-gray-900">
                Include me in the community directory
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Allow other residents to find and contact you through the community directory
              </p>
            </div>
          </div>

          {formData.is_directory_visible && (
            <div className="ml-7 space-y-3 bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Choose what information to display:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="directory_show_name"
                    name="directory_show_name"
                    type="checkbox"
                    checked={formData.directory_show_name}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="directory_show_name" className="ml-2 text-sm text-gray-700">
                    Full Name
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="directory_show_unit"
                    name="directory_show_unit"
                    type="checkbox"
                    checked={formData.directory_show_unit}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="directory_show_unit" className="ml-2 text-sm text-gray-700">
                    Unit Number
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="directory_show_phone"
                    name="directory_show_phone"
                    type="checkbox"
                    checked={formData.directory_show_phone}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="directory_show_phone" className="ml-2 text-sm text-gray-700">
                    Phone Number
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="directory_show_email"
                    name="directory_show_email"
                    type="checkbox"
                    checked={formData.directory_show_email}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="directory_show_email" className="ml-2 text-sm text-gray-700">
                    Email Address
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="directory_show_household"
                    name="directory_show_household"
                    type="checkbox"
                    checked={formData.directory_show_household}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="directory_show_household" className="ml-2 text-sm text-gray-700">
                    Household Members
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Eye className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Control who can view your detailed profile information beyond the directory listing.
          </p>
          
          {profileVisibilityOptions.map((option) => (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`visibility_${option.value}`}
                  name="profile_visibility"
                  type="radio"
                  value={option.value}
                  checked={formData.profile_visibility === option.value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={`visibility_${option.value}`} className="text-sm font-medium text-gray-900">
                  {option.label}
                </label>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Information */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Data Privacy Rights</h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Your Privacy Rights</h4>
              <ul className="mt-1 text-xs text-blue-700 space-y-1">
                <li>• You can update these settings at any time</li>
                <li>• Emergency contact information is always accessible to HOA staff for safety</li>
                <li>• Financial information is never shared in the directory</li>
                <li>• You can request to download or delete your data at any time</li>
                <li>• Directory information is only visible to other community members</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Data Usage Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Quick Privacy Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                is_directory_visible: false,
                profile_visibility: 'admin'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
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
                profile_visibility: 'members'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
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
                profile_visibility: 'all'
              }))}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              Full Community Sharing
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
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