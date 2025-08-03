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
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{option.title}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name={option.key}
                  checked={formData[option.key]}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {formData[option.key] ? 'On' : 'Off'}
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