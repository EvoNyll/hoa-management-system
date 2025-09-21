import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Bell, Save, Loader, CheckCircle } from 'lucide-react';

const NotificationSection = () => {
  const { profileData, loading, updateNotificationSettings } = useProfile();
  const [formData, setFormData] = useState({
    email_notifications: true,
    sms_notifications: false,
    newsletter_subscription: true,
    event_reminders: true,
    maintenance_updates: true,
    billing_notifications: true,
    community_announcements: true,
    forum_notifications: false,
    ...profileData.notifications
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (profileData.notifications) {
      setFormData(prev => ({
        ...prev,
        ...profileData.notifications
      }));
    }
  }, [profileData.notifications]);

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await updateNotificationSettings(formData);
      setSuccessMessage('Notification preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update notification settings error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const notificationOptions = [
    {
      key: 'email_notifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email'
    },
    {
      key: 'sms_notifications',
      title: 'SMS Notifications',
      description: 'Receive notifications via text message'
    },
    {
      key: 'newsletter_subscription',
      title: 'Community Newsletter',
      description: 'Monthly community newsletter and updates'
    },
    {
      key: 'event_reminders',
      title: 'Event Reminders',
      description: 'Reminders about upcoming community events'
    },
    {
      key: 'maintenance_updates',
      title: 'Maintenance Updates',
      description: 'Notifications about maintenance and repairs'
    },
    {
      key: 'billing_notifications',
      title: 'Billing Notifications',
      description: 'HOA dues and payment reminders'
    },
    {
      key: 'community_announcements',
      title: 'Community Announcements',
      description: 'Important announcements from the HOA board'
    },
    {
      key: 'forum_notifications',
      title: 'Forum Activity',
      description: 'Notifications about forum posts and replies'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-300">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{option.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={option.key}
                  checked={formData[option.key]}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formData[option.key] ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          ))}
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
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSection;