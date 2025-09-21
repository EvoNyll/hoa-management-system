import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Save, Loader, CheckCircle, Monitor, Globe, Clock, Sun, Moon, Laptop } from 'lucide-react';

const SystemPreferencesSection = () => {
  const { profileData, loading, updateSystemPreferences } = useProfile();
  const { theme, updateTheme, syncThemeFromProfile, isInitialized } = useTheme();
  const [formData, setFormData] = useState({
    theme_preference: theme || 'light',
    language_preference: 'en',
    timezone_setting: 'America/New_York',
    date_format: 'MM/DD/YYYY',
    time_format: '12',
    ...profileData.system
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (profileData.system) {
      setFormData(prev => ({
        ...prev,
        ...profileData.system
      }));

      // Sync theme with backend data if ThemeContext is initialized
      if (isInitialized && profileData.system.theme_preference) {
        syncThemeFromProfile(profileData.system.theme_preference);
      }
    }
  }, [profileData.system, isInitialized, syncThemeFromProfile]);

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      theme_preference: theme
    }));
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update theme immediately when changed
    if (name === 'theme_preference') {
      updateTheme(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await updateSystemPreferences(formData);
      // Ensure theme is also saved to localStorage for persistence across refreshes
      updateTheme(formData.theme_preference);
      setSuccessMessage('System preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update system preferences error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Preferences</h3>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Appearance</h4>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme Preference
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light Theme', icon: Sun, description: 'Light theme for bright environments' },
                { value: 'dark', label: 'Dark Theme', icon: Moon, description: 'Dark theme for low-light environments' },
                { value: 'system', label: 'System Default', icon: Laptop, description: 'Follows your device settings' }
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = formData.theme_preference === option.value;
                return (
                  <div key={option.value} className="relative">
                    <input
                      id={`theme_${option.value}`}
                      name="theme_preference"
                      type="radio"
                      value={option.value}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`theme_${option.value}`}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all min-h-[120px] ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <span className={`font-medium text-sm mb-1 ${
                        isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs text-center leading-tight ${
                        isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-2 right-2" />
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Language & Region</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                name="language_preference"
                value={formData.language_preference}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                name="timezone_setting"
                value={formData.timezone_setting}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="America/New_York">Eastern Time (UTC-5)</option>
                <option value="America/Chicago">Central Time (UTC-6)</option>
                <option value="America/Denver">Mountain Time (UTC-7)</option>
                <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time Format */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Date & Time Format</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                name="date_format"
                value={formData.date_format}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                <option value="DD MMM YYYY">DD MMM YYYY (31 Dec 2024)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                name="time_format"
                value={formData.time_format}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="12">12 Hour (3:30 PM)</option>
                <option value="24">24 Hour (15:30)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemPreferencesSection;