// File: frontend/src/components/profile/SystemPreferencesSection.jsx
// Location: frontend/src/components/profile/SystemPreferencesSection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Settings, Palette, Globe, Clock, Save, Loader, CheckCircle, Monitor, Sun, Moon } from 'lucide-react';

const SystemPreferencesSection = () => {
  const { profileData, loading, updateSystemPreferences } = useProfile();
  const [formData, setFormData] = useState({
    theme_preference: 'light',
    language_preference: 'en',
    timezone_setting: 'UTC',
    ...profileData.system
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (profileData.system) {
      setFormData(prev => ({
        ...prev,
        ...profileData.system
      }));
    }
  }, [profileData.system]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      await updateSystemPreferences(formData);
      setSuccessMessage('System preferences updated successfully!');
      
      // Apply theme change immediately if supported
      if (formData.theme_preference !== 'auto') {
        document.documentElement.classList.toggle('dark', formData.theme_preference === 'dark');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update system preferences:', err);
      setErrors({ submit: err.message || 'Failed to update system preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const themes = [
    { 
      value: 'light', 
      label: 'Light Theme', 
      description: 'Clean, bright interface with light backgrounds',
      icon: Sun,
      preview: 'bg-white border-gray-200 text-gray-900'
    },
    { 
      value: 'dark', 
      label: 'Dark Theme', 
      description: 'Easy on the eyes with dark backgrounds',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700 text-white'
    },
    { 
      value: 'auto', 
      label: 'Auto (System)', 
      description: 'Follows your device system theme setting',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400 text-gray-700'
    }
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'pt', label: 'Português', flag: '🇵🇹' },
    { value: 'zh', label: '中文', flag: '🇨🇳' },
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
    { value: 'ko', label: '한국어', flag: '🇰🇷' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00' },
    { value: 'America/Phoenix', label: 'Arizona Time (MST)', offset: '-07:00' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKST)', offset: '-09:00' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)', offset: '-10:00' },
    { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)', offset: '+11:00' }
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

      {/* Theme Preferences */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Palette className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Theme Preference</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose your preferred interface theme. The auto setting will match your device system preference.
          </p>
          
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <div key={theme.value} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`theme_${theme.value}`}
                    name="theme_preference"
                    type="radio"
                    value={theme.value}
                    checked={formData.theme_preference === theme.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 text-gray-400 mr-2" />
                      <label htmlFor={`theme_${theme.value}`} className="text-sm font-medium text-gray-900">
                        {theme.label}
                      </label>
                    </div>
                    <div className={`w-12 h-6 rounded border-2 ${theme.preview}`}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language Preferences */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Language Preference</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Select your preferred language for the interface. Some languages may have limited translation coverage.
          </p>
          
          <div>
            <label htmlFor="language_preference" className="block text-sm font-medium text-gray-700 mb-1">
              Interface Language
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
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {formData.language_preference !== 'en' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-xs text-yellow-700">
                <strong>Note:</strong> Some features may still appear in English while we complete the translation. 
                If you notice any untranslated text, please report it to the HOA administration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Timezone Settings */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Timezone Setting</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Set your timezone to ensure event times, due dates, and notifications are displayed correctly.
          </p>
          
          <div>
            <label htmlFor="timezone_setting" className="block text-sm font-medium text-gray-700 mb-1">
              Your Timezone
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
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-700">
              <strong>Current time in your timezone:</strong> {new Date().toLocaleString('en-US', { 
                timeZone: formData.timezone_setting || 'UTC',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Additional Preferences</h3>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Accessibility Options</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>High contrast mode:</span>
              <button
                type="button"
                onClick={() => document.documentElement.classList.toggle('high-contrast')}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Toggle
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Large text mode:</span>
              <button
                type="button"
                onClick={() => document.documentElement.classList.toggle('large-text')}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Toggle
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Reduced motion:</span>
              <button
                type="button"
                onClick={() => document.documentElement.classList.toggle('reduce-motion')}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Toggle
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Browser Compatibility</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• <strong>Recommended browsers:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</p>
            <p>• <strong>Mobile:</strong> iOS Safari 14+, Chrome for Android 90+</p>
            <p>• <strong>JavaScript:</strong> Required for full functionality</p>
            <p>• <strong>Cookies:</strong> Required for authentication and preferences</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Performance Tips</h4>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Clear your browser cache if you experience display issues</p>
            <p>• Enable JavaScript for the best experience</p>
            <p>• Use the latest version of your browser for optimal performance</p>
            <p>• Close unnecessary browser tabs to improve responsiveness</p>
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
          {isSubmitting ? 'Saving...' : 'Save System Preferences'}
        </button>
      </div>
    </form>
  );
};

export default SystemPreferencesSection;