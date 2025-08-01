// frontend/src/pages/Private/Account.jsx
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

// Remove the duplicate import - use exportProfileData from context instead

const Account = () => {
  const { user } = useAuth();
  const { profileData, loading, error, loadProfileData, clearError, exportProfileData } = useProfile();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCompletionTip, setShowCompletionTip] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user, loadProfileData]);

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
      console.log('🔄 Starting profile data export...')
      
      // Use the exportProfileData function from ProfileContext
      await exportProfileData()
      
      console.log('✅ Profile data export completed')
      
    } catch (err) {
      console.error('❌ Failed to export data:', err)
      alert('Failed to export data. Please try again.')
    }
  }

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              loadProfileData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export Data'}
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
                    Profile {profileData.completionStatus.overall_percentage === 100 ? 
                      'Complete!' : 
                      `${profileData.completionStatus.overall_percentage}% Complete`}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {profileData.completionStatus.overall_percentage === 100 ? 
                      'Your profile information is complete and up to date.' :
                      'Complete your profile to get the most out of our community features.'
                    }
                  </p>
                  {profileData.completionStatus.suggestions && profileData.completionStatus.suggestions.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                      {profileData.completionStatus.suggestions.slice(0, 3).map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowCompletionTip(false)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileData.completionStatus.overall_percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {profileTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {profileTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Account;