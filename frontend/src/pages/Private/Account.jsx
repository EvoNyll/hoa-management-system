// File: frontend/src/pages/Private/Account.jsx
// Location: frontend/src/pages/Private/Account.jsx

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Home, 
  Shield, 
  Phone, 
  Lock, 
  CreditCard, 
  Bell, 
  Settings, 
  Users, 
  Car, 
  Heart,
  Download,
  History,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

// Import profile section components
import BasicProfileSection from '../../components/profile/BasicProfileSection';
import ResidenceSection from '../../components/profile/ResidenceSection';
import EmergencySection from '../../components/profile/EmergencySection';
import PrivacySection from '../../components/profile/PrivacySection';
import SecuritySection from '../../components/profile/SecuritySection';
import FinancialSection from '../../components/profile/FinancialSection';
import NotificationSection from '../../components/profile/NotificationSection';
import SystemPreferencesSection from '../../components/profile/SystemPreferencesSection';
import HouseholdMembersSection from '../../components/profile/HouseholdMembersSection';
import PetsSection from '../../components/profile/PetsSection';
import VehiclesSection from '../../components/profile/VehiclesSection';
import ChangeLogsSection from '../../components/profile/ChangeLogsSection';

const Account = () => {
  const { user } = useAuth();
  const { profileData, loading, error, loadProfileData, clearError, exportProfileData } = useProfile();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCompletionTip, setShowCompletionTip] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const profileTabs = [
    { id: 'basic', label: 'Basic Info', icon: User, description: 'Personal information and contact details' },
    { id: 'residence', label: 'Residence', icon: Home, description: 'Property and household information' },
    { id: 'emergency', label: 'Emergency', icon: Phone, description: 'Emergency contacts and medical info' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Directory visibility and privacy settings' },
    { id: 'security', label: 'Security', icon: Lock, description: 'Password and authentication settings' },
    { id: 'financial', label: 'Financial', icon: CreditCard, description: 'Payment preferences and billing' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Communication preferences' },
    { id: 'system', label: 'System', icon: Settings, description: 'Theme and interface preferences' },
    { id: 'household', label: 'Household', icon: Users, description: 'Family members and residents' },
    { id: 'pets', label: 'Pets', icon: Heart, description: 'Pet registration and information' },
    { id: 'vehicles', label: 'Vehicles', icon: Car, description: 'Vehicle registration and parking' },
    { id: 'activity', label: 'Activity', icon: History, description: 'Profile change history and logs' },
  ];

  const handleExportData = async () => {
    try {
      await exportProfileData();
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicProfileSection />;
      case 'residence':
        return <ResidenceSection />;
      case 'emergency':
        return <EmergencySection />;
      case 'privacy':
        return <PrivacySection />;
      case 'security':
        return <SecuritySection />;
      case 'financial':
        return <FinancialSection />;
      case 'notifications':
        return <NotificationSection />;
      case 'system':
        return <SystemPreferencesSection />;
      case 'household':
        return <HouseholdMembersSection />;
      case 'pets':
        return <PetsSection />;
      case 'vehicles':
        return <VehiclesSection />;
      case 'activity':
        return <ChangeLogsSection />;
      default:
        return <BasicProfileSection />;
    }
  };

  if (loading && !profileData.basic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your profile information and preferences</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Profile Completion Status */}
        {profileData.completionStatus && showCompletionTip && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {profileData.completionStatus.overall_percentage === 100 ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Profile {profileData.completionStatus.overall_percentage === 100 ? 'Complete' : 'In Progress'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your profile is {profileData.completionStatus.overall_percentage}% complete
                  </p>
                  {profileData.completionStatus.suggestions?.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      {profileData.completionStatus.suggestions.slice(0, 2).map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${profileData.completionStatus.overall_percentage}%` }}
                  />
                </div>
                <button
                  onClick={() => setShowCompletionTip(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            </div>
            
            <nav className="space-y-1 p-2">
              {profileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('security')}
                className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Update Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Privacy Settings
              </button>
              <button
                onClick={handleExportData}
                className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Download My Data
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Section Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                {(() => {
                  const activeTabData = profileTabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon || User;
                  return <Icon className="w-6 h-6 text-blue-600 mr-3" />;
                })()}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {profileTabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;