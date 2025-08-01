// File: frontend/src/components/profile/NotificationSection.jsx
// Location: frontend/src/components/profile/NotificationSection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Save, Bell, BellOff, Mail, MessageSquare, Smartphone, Loader, CheckCircle } from 'lucide-react';

const NotificationSection = () => {
  const { profileData, loading, updateNotificationSettings } = useProfile();
  const [formData, setFormData] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    notification_preferences: {},
    ...profileData.notifications
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Update form data when profile data changes
  React.useEffect(() => {
    if (profileData.notifications) {
      setFormData(prev => ({
        ...prev,
        ...profileData.notifications
      }));
    }
  }, [profileData.notifications]);

  const notificationCategories = [
    {
      key: 'hoa_announcements',
      label: 'HOA Announcements',
      description: 'General community news and important updates',
      icon: Bell,
      defaultEnabled: true
    },
    {
      key: 'maintenance_alerts',
      label: 'Maintenance Alerts',
      description: 'Scheduled maintenance and utility interruptions',
      icon: Bell,
      defaultEnabled: true
    },
    {
      key: 'emergency_notifications',
      label: 'Emergency Notifications',
      description: 'Safety alerts and urgent communications',
      icon: Bell,
      defaultEnabled: true,
      required: true
    },
    {
      key: 'event_invitations',
      label: 'Event Invitations',
      description: 'Community events and social gatherings',
      icon: Bell,
      defaultEnabled: true
    },
    {
      key: 'payment_reminders',
      label: 'Payment Reminders',
      description: 'HOA dues and fee notifications',
      icon: Bell,
      defaultEnabled: true
    },
    {
      key: 'booking_confirmations',
      label: 'Booking Confirmations',
      description: 'Amenity reservations and changes',
      icon: Bell,
      defaultEnabled: true
    },
    {
      key: 'forum_activity',
      label: 'Forum Activity',
      description: 'New posts, replies, and mentions',
      icon: MessageSquare,
      defaultEnabled: false
    }
  ];

  const deliveryMethods = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'push', label: 'Push Notification', icon: Smartphone },
    { value: 'none', label: 'Disabled', icon: BellOff }
  ];

  const frequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'none', label: 'Disabled' }
  ];

  const handleGlobalToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryKey, setting, value) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [categoryKey]: {
          ...prev.notification_preferences[categoryKey],
          [setting]: value
        }
      }
    }));
  };

  const getCategorySettings = (categoryKey) => {
    return formData.notification_preferences?.[categoryKey] || {
      enabled: notificationCategories.find(cat => cat.key === categoryKey)?.defaultEnabled || false,
      method: 'email',
      frequency: 'immediate'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      await updateNotificationSettings(formData);
      setSuccessMessage('Notification settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setErrors({ submit: err.message || 'Failed to update notification settings' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Global Notification Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Global Notification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.email_notifications}
                onChange={(e) => handleGlobalToggle('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications via text message</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sms_notifications}
                onChange={(e) => handleGlobalToggle('sms_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications in the app</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.push_notifications}
                onChange={(e) => handleGlobalToggle('push_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Category-Specific Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Categories</h3>
        
        <div className="space-y-6">
          {notificationCategories.map((category) => {
            const settings = getCategorySettings(category.key);
            const Icon = category.icon;
            
            return (
              <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {category.label}
                        {category.required && (
                          <span className="ml-1 text-xs text-red-500">(Required)</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => handleCategoryChange(category.key, 'enabled', e.target.checked)}
                      disabled={category.required}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${category.required ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>

                {settings.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Delivery Method
                      </label>
                      <select
                        value={settings.method || 'email'}
                        onChange={(e) => handleCategoryChange(category.key, 'method', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {deliveryMethods.map(method => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        value={settings.frequency || 'immediate'}
                        onChange={(e) => handleCategoryChange(category.key, 'frequency', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {frequencies.map(freq => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Bell className="w-5 h-5 text-blue-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Important Notes</h4>
            <ul className="mt-1 text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Emergency notifications cannot be disabled for safety reasons</li>
              <li>SMS notifications require a verified phone number</li>
              <li>Daily digests are sent at 8:00 AM in your local timezone</li>
              <li>Weekly summaries are sent every Monday morning</li>
            </ul>
          </div>
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
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default NotificationSection;