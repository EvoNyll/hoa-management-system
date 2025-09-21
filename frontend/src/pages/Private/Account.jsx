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
  Loader,
  X,
  ChevronRight
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
  const { user, isAuthenticated } = useAuth();
  const { profileData, loading, error, loadProfileData, clearError, exportProfileData } = useProfile();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCompletionTip, setShowCompletionTip] = useState(true);

  useEffect(() => {
    if (user && isAuthenticated) {
      loadProfileData();
    }
  }, [user?.id, isAuthenticated]);

  // Check for sessionStorage to set active tab (for direct navigation from other pages)
  useEffect(() => {
    const savedTab = sessionStorage.getItem('accountActiveTab');
    if (savedTab && ['basic', 'residence', 'emergency', 'privacy', 'security', 'financial', 'notifications', 'system', 'household', 'pets', 'vehicles', 'change-logs'].includes(savedTab)) {
      setActiveTab(savedTab);
      // Clear the sessionStorage after using it
      sessionStorage.removeItem('accountActiveTab');
    }
  }, []); 

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

  if (loading && !profileData?.basic && Object.keys(profileData || {}).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600 dark:text-red-400" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              if (user && isAuthenticated) {
                loadProfileData();
              }
            }}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeTabData = profileTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your profile information and preferences</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportData}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>

          {/* Profile Completion Status */}
          {profileData?.completionStatus && showCompletionTip && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {profileData.completionStatus.overall_percentage === 100 ? (
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-blue-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
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
                      <ul className="text-sm text-gray-600 mt-3 space-y-1">
                        {profileData.completionStatus.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index} className="flex items-center">
                            <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowCompletionTip(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Profile completion</span>
                  <span>{profileData.completionStatus.overall_percentage}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${profileData.completionStatus.overall_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Choose a section to manage</p>
              </div>
              
              <nav className="p-3">
                {profileTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-lg text-sm font-medium transition-all duration-200 mb-1 group ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                        <div className="flex-1">
                          <div className="font-medium">{tab.label}</div>
                          <div className={`text-xs mt-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {tab.description}
                          </div>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('security')}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Change Password
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-4 h-4 inline mr-2" />
                  Update Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Privacy Settings
                </button>
                <button
                  onClick={handleExportData}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download My Data
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center">
                  {(() => {
                    const Icon = activeTabData?.icon || User;
                    return <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4" />;
                  })()}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeTabData?.label}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activeTabData?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Content with proper padding */}
              <div className="p-8">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;