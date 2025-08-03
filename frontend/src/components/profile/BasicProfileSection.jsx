import React, { useState, useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Camera, User, Save, X, Loader, CheckCircle } from 'lucide-react';

const BasicProfileSection = () => {
  const { profileData, loading, updateBasicProfile } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    preferred_contact_method: 'email',
    best_contact_time: 'anytime',
    language_preference: 'en',
    timezone_setting: 'UTC',
    ...profileData.basic
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Update form data when profile data changes
  React.useEffect(() => {
    if (profileData.basic) {
      setFormData(prev => ({
        ...prev,
        ...profileData.basic
      }));
    }
  }, [profileData.basic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) { 
        setErrors(prev => ({
          ...prev,
          profile_photo: 'Profile photo must be less than 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_photo: 'Please select a valid image file'
        }));
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        profile_photo: null
      }));
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const submitData = { ...formData };
      
      if (selectedFile) {
        submitData.profile_photo = selectedFile;
      }

      await updateBasicProfile(submitData);
      setSuccessMessage('Profile updated successfully!');
      setSelectedFile(null);
      setProfilePhotoPreview(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrors({ submit: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' },
    { value: 'app', label: 'App Notifications' }
  ];

  const contactTimes = [
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-10PM)' },
    { value: 'anytime', label: 'Anytime' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'America/Phoenix', label: 'Arizona Time' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : profileData.basic?.profile_photo ? (
                <img
                  src={profileData.basic.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            {(profilePhotoPreview || selectedFile) && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Camera className="w-4 h-4 mr-2" />
              {profileData.basic?.profile_photo ? 'Change Photo' : 'Upload Photo'}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
            </p>
            
            {errors.profile_photo && (
              <p className="text-xs text-red-600 mt-1">{errors.profile_photo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
          </label>
          <select
            id="preferred_contact_method"
            name="preferred_contact_method"
            value={formData.preferred_contact_method || 'email'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contactMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="best_contact_time" className="block text-sm font-medium text-gray-700 mb-1">
            Best Time to Contact
          </label>
          <select
            id="best_contact_time"
            name="best_contact_time"
            value={formData.best_contact_time || 'anytime'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contactTimes.map(time => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language_preference" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            id="language_preference"
            name="language_preference"
            value={formData.language_preference || 'en'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timezone_setting" className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            id="timezone_setting"
            name="timezone_setting"
            value={formData.timezone_setting || 'UTC'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Button */}
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default BasicProfileSection;