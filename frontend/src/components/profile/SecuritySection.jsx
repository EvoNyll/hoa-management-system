import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, Save, Loader, CheckCircle, Shield, Key, AlertTriangle, 
  Mail, Smartphone, Monitor, MapPin, Copy, Download, X, Info,
  Globe, Clock, Trash2, LogOut
} from 'lucide-react';

const SecuritySection = () => {
  const { user } = useAuth();
  const {
    profileData,
    loading,
    changePassword,
    requestEmailVerification,
    verifyEmail,
    updateTwoFactorSetting,
    setupTwoFactor,
    verifyTotpSetup,
    disableTwoFactor,
    generateBackupCodes,
    generateMockBackupCodes,
    getLoginActivity,
    terminateSession,
    terminateAllSessions
  } = useProfile();

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  // Email Verification State
  const [emailData, setEmailData] = useState({
    new_email: ''
  });
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailErrors, setEmailErrors] = useState({});
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Two-Factor Authentication State
  const [isSubmitting2FA, setIsSubmitting2FA] = useState(false);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState('');
  const [twoFactorErrors, setTwoFactorErrors] = useState({});
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  // Login Activity State
  const [loginActivity, setLoginActivity] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activitySuccess, setActivitySuccess] = useState('');
  const [activityErrors, setActivityErrors] = useState({});

  // Active Tab State
  const [activeTab, setActiveTab] = useState('password');

  // Load login activity on component mount
  useEffect(() => {
    loadLoginActivity();
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    const timeouts = [];
    
    if (passwordSuccess) timeouts.push(setTimeout(() => setPasswordSuccess(''), 5000));
    if (emailSuccess) timeouts.push(setTimeout(() => setEmailSuccess(''), 5000));
    if (twoFactorSuccess) timeouts.push(setTimeout(() => setTwoFactorSuccess(''), 5000));
    if (activitySuccess) timeouts.push(setTimeout(() => setActivitySuccess(''), 5000));
    
    return () => timeouts.forEach(clearTimeout);
  }, [passwordSuccess, emailSuccess, twoFactorSuccess, activitySuccess]);

  // Password Change Functions
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.current_password.trim()) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!passwordData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirm_password.trim()) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    setPasswordErrors({});
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setIsSubmittingPassword(true);
    setPasswordSuccess('');

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      
    } catch (error) {
      if (error.message?.includes('Current password is incorrect')) {
        setPasswordErrors({ current_password: 'Current password is incorrect' });
      } else {
        setPasswordErrors({ general: error.message || 'Failed to update password. Please try again.' });
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Email Verification Functions
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
    if (emailErrors[name]) {
      setEmailErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEmailVerificationRequest = async (e) => {
    e.preventDefault();
    
    if (!emailData.new_email.trim()) {
      setEmailErrors({ new_email: 'Email address is required' });
      return;
    }

    setIsSubmittingEmail(true);
    setEmailSuccess('');
    setEmailErrors({});

    try {
      const result = await requestEmailVerification(emailData.new_email);
      setEmailSuccess(result.message || 'Verification email sent! Please check your inbox.');
      setEmailVerificationSent(true);
      
      // Show additional note if it's a mock response
      if (result.note) {
        setEmailSuccess(result.message + ' Note: ' + result.note);
      }
    } catch (error) {
      setEmailErrors({ general: error.message || 'Failed to send verification email' });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Two-Factor Authentication Functions
  const handleToggle2FA = async (enabled) => {
    if (enabled) {
      await handleStartSetup();
    } else {
      setShowDisableDialog(true);
    }
  };

  const handleStartSetup = async () => {
    setIsSubmitting2FA(true);
    setTwoFactorSuccess('');
    setTwoFactorErrors({});

    try {
      const result = await setupTwoFactor();
      setQrCodeUrl(result.qr_code);
      setSecret(result.secret);
      setShowSetupForm(true);
      setTwoFactorSuccess('Scan the QR code with your authenticator app and enter the verification code below.');
    } catch (error) {
      setTwoFactorErrors({ general: error.message || 'Failed to setup two-factor authentication' });
    } finally {
      setIsSubmitting2FA(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!setupToken.trim()) {
      setTwoFactorErrors({ token: 'Please enter the verification code' });
      return;
    }

    if (!secret) {
      setTwoFactorErrors({ token: 'Setup secret not found. Please restart the setup process.' });
      return;
    }

    setIsSubmitting2FA(true);
    setTwoFactorErrors({});

    try {
      const result = await verifyTotpSetup(secret, setupToken);
      setBackupCodes(result.backup_codes || []);
      setShowBackupCodes(true);
      setShowSetupForm(false);
      setSetupToken('');
      setQrCodeUrl('');
      setSecret('');
      setTwoFactorSuccess('Two-factor authentication enabled successfully! Please save your backup codes.');
    } catch (error) {
      setTwoFactorErrors({ token: error.message || 'Invalid verification code' });
    } finally {
      setIsSubmitting2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) {
      setTwoFactorErrors({ password: 'Password is required to disable 2FA' });
      return;
    }

    setIsSubmitting2FA(true);
    setTwoFactorSuccess('');
    setTwoFactorErrors({});

    try {
      await disableTwoFactor(disablePassword);
      setTwoFactorSuccess('Two-factor authentication disabled successfully!');
      setBackupCodes([]);
      setShowBackupCodes(false);
      setShowSetupForm(false);
      setShowDisableDialog(false);
      setDisablePassword('');
      setQrCodeUrl('');
      setSecret('');
      setSetupToken('');
    } catch (error) {
      setTwoFactorErrors({ password: error.message || 'Failed to disable two-factor authentication' });
    } finally {
      setIsSubmitting2FA(false);
    }
  };

  const handleCancelDisable = () => {
    setShowDisableDialog(false);
    setDisablePassword('');
    setTwoFactorErrors({});
  };

  const handleGenerateNewBackupCodes = async () => {
    setIsSubmitting2FA(true);

    try {
      const result = await generateBackupCodes();
      setBackupCodes(result.backup_codes || []);
      setTwoFactorSuccess('New backup codes generated successfully!');
      setShowBackupCodes(true);
    } catch (error) {
      setTwoFactorErrors({ general: error.message || 'Failed to generate backup codes' });
    } finally {
      setIsSubmitting2FA(false);
    }
  };

  const handleCancelSetup = () => {
    setShowSetupForm(false);
    setQrCodeUrl('');
    setSecret('');
    setSetupToken('');
    setTwoFactorErrors({});
    setTwoFactorSuccess('');
  };

  // Login Activity Functions
  const loadLoginActivity = async () => {
    setIsLoadingActivity(true);
    setActivityErrors({});

    try {
      const activity = await getLoginActivity();
      setLoginActivity(activity.sessions || []);
    } catch (error) {
      setActivityErrors({ general: error.message || 'Failed to load login activity' });
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await terminateSession(sessionId);
      setActivitySuccess('Session terminated successfully!');
      loadLoginActivity(); // Reload activity
    } catch (error) {
      setActivityErrors({ general: error.message || 'Failed to terminate session' });
    }
  };

  const handleTerminateAllSessions = async () => {
    if (!window.confirm('This will log you out of all devices. Continue?')) return;

    try {
      await terminateAllSessions();
      setActivitySuccess('All sessions terminated successfully!');
      loadLoginActivity(); // Reload activity
    } catch (error) {
      setActivityErrors({ general: error.message || 'Failed to terminate all sessions' });
    }
  };

  // Utility Functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTwoFactorSuccess('Copied to clipboard!');
  };

  const downloadBackupCodes = () => {
    const content = `HOA Portal - Two-Factor Authentication Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nImportant: Keep these codes secure and do not share them.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hoa-portal-backup-codes.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (userAgent) => {
    if (userAgent?.includes('Mobile')) return <Smartphone className="w-4 h-4" />;
    if (userAgent?.includes('Tablet')) return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const tabs = [
    { id: 'password', label: 'Password', icon: Key },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'twofactor', label: '2FA', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Monitor }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            Security Settings
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage your account security, password, and authentication settings.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-medium text-gray-900">Change Password</h4>
            </div>

            {/* Success/Error Messages */}
            {passwordSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <p className="text-sm text-green-700 font-medium">{passwordSuccess}</p>
                </div>
              </div>
            )}

            {passwordErrors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-700 font-medium">{passwordErrors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.current_password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your current password"
                />
                {passwordErrors.current_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.new_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your new password"
                  />
                  {passwordErrors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your new password"
                  />
                  {passwordErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingPassword ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSubmittingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Email Verification Tab */}
        {activeTab === 'email' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-medium text-gray-900">Email Verification</h4>
            </div>

            {/* Current Email Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Email</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Verified
                </span>
              </div>
            </div>

            {/* Success/Error Messages */}
            {emailSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <p className="text-sm text-green-700 font-medium">{emailSuccess}</p>
                </div>
              </div>
            )}

            {emailErrors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-700 font-medium">{emailErrors.general}</p>
                </div>
              </div>
            )}

            {/* Change Email Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Email Address
                </label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    name="new_email"
                    value={emailData.new_email}
                    onChange={handleEmailChange}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      emailErrors.new_email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new email address"
                    disabled={emailVerificationSent}
                  />
                  <button
                    onClick={handleEmailVerificationRequest}
                    disabled={isSubmittingEmail || emailVerificationSent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingEmail ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : emailVerificationSent ? (
                      'Sent'
                    ) : (
                      'Send Verification'
                    )}
                  </button>
                </div>
                {emailErrors.new_email && (
                  <p className="mt-1 text-sm text-red-600">{emailErrors.new_email}</p>
                )}
              </div>

              {emailVerificationSent && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    We've sent a verification link to <strong>{emailData.new_email}</strong>. 
                    Please check your email and click the link to verify your new email address.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Tab */}
        {activeTab === 'twofactor' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h4>
            </div>

            {/* Success/Error Messages */}
            {twoFactorSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <p className="text-sm text-green-700 font-medium">{twoFactorSuccess}</p>
                </div>
              </div>
            )}

            {twoFactorErrors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-700 font-medium">{twoFactorErrors.general}</p>
                </div>
              </div>
            )}

            {/* 2FA Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">
                    {profileData.security?.two_factor_enabled 
                      ? 'Your account is protected with two-factor authentication' 
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    profileData.security?.two_factor_enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profileData.security?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => handleToggle2FA(!profileData.security?.two_factor_enabled)}
                    disabled={isSubmitting2FA}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      profileData.security?.two_factor_enabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting2FA ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : profileData.security?.two_factor_enabled ? (
                      'Disable'
                    ) : (
                      'Enable'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">About Two-Factor Authentication:</p>
                  <ul className="space-y-1">
                    <li>• Adds an extra layer of security to your account</li>
                    <li>• Requires both your password and a verification code</li>
                    <li>• Protects against unauthorized access even if your password is compromised</li>
                    <li>• Works with authenticator apps like Google Authenticator or Authy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2FA Setup Form */}
            {showSetupForm && (
              <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-lg font-medium text-blue-900 mb-4">Set up Two-Factor Authentication</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div>
                    <h6 className="font-medium text-gray-900 mb-3">1. Scan QR Code</h6>
                    {qrCodeUrl ? (
                      <div className="p-4 bg-white border rounded-lg text-center">
                        <img src={qrCodeUrl} alt="2FA Setup QR Code" className="mx-auto max-w-full h-auto" />
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-100 border rounded-lg text-center">
                        <Loader className="w-8 h-8 animate-spin text-gray-500 mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Loading QR code...</p>
                      </div>
                    )}

                    {/* Manual Secret */}
                    {secret && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">Can't scan? Enter this code manually:</p>
                        <div className="p-2 bg-gray-100 border rounded text-xs font-mono break-all">
                          {secret}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verification */}
                  <div>
                    <h6 className="font-medium text-gray-900 mb-3">2. Enter Verification Code</h6>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={setupToken}
                        onChange={(e) => {
                          setSetupToken(e.target.value.replace(/\D/g, '')); // Only digits
                          if (twoFactorErrors.token) setTwoFactorErrors(prev => ({ ...prev, token: null }));
                        }}
                        maxLength="6"
                        placeholder="Enter 6-digit code"
                        className={`w-full px-3 py-2 border rounded-md text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          twoFactorErrors.token ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {twoFactorErrors.token && (
                        <p className="text-sm text-red-600">{twoFactorErrors.token}</p>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={handleVerifySetup}
                          disabled={isSubmitting2FA || !setupToken.trim()}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSubmitting2FA ? (
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Verify & Enable
                        </button>
                        <button
                          onClick={handleCancelSetup}
                          disabled={isSubmitting2FA}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disable 2FA Password Dialog */}
            {showDisableDialog && (
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="text-lg font-medium text-red-900 mb-4">Confirm Disable Two-Factor Authentication</h5>
                <p className="text-sm text-red-700 mb-4">
                  To disable two-factor authentication, please enter your account password to confirm this action.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={disablePassword}
                      onChange={(e) => {
                        setDisablePassword(e.target.value);
                        if (twoFactorErrors.password) setTwoFactorErrors(prev => ({ ...prev, password: null }));
                      }}
                      placeholder="Enter your password"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        twoFactorErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {twoFactorErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{twoFactorErrors.password}</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleDisable2FA}
                      disabled={isSubmitting2FA || !disablePassword.trim()}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting2FA ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting2FA ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                    <button
                      onClick={handleCancelDisable}
                      disabled={isSubmitting2FA}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generate New Backup Codes (if 2FA is enabled) */}
            {profileData.security?.two_factor_enabled && !showSetupForm && (
              <div className="mb-6">
                <button
                  onClick={handleGenerateNewBackupCodes}
                  disabled={isSubmitting2FA}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting2FA ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4 mr-2" />
                  )}
                  Generate New Backup Codes
                </button>
              </div>
            )}

            {/* Backup Codes Display */}
            {showBackupCodes && backupCodes.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 text-yellow-600 mr-2" />
                    <h5 className="font-medium text-yellow-900">Backup Codes</h5>
                  </div>
                  <button
                    onClick={() => setShowBackupCodes(false)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-yellow-800 mb-3">
                  Save these backup codes in a secure location. Each code can only be used once if you lose access to your authenticator app.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white border rounded font-mono text-sm"
                    >
                      <span>{code}</span>
                      <button
                        onClick={() => copyToClipboard(code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadBackupCodes}
                    className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Login Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-indigo-600" />
                <h4 className="text-lg font-medium text-gray-900">Login Activity</h4>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadLoginActivity}
                  disabled={isLoadingActivity}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                >
                  {isLoadingActivity ? (
                    <Loader className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    'Refresh'
                  )}
                </button>
                <button
                  onClick={handleTerminateAllSessions}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  End All Sessions
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {activitySuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <p className="text-sm text-green-700 font-medium">{activitySuccess}</p>
                </div>
              </div>
            )}

            {activityErrors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-700 font-medium">{activityErrors.general}</p>
                </div>
              </div>
            )}

            {/* Login Sessions */}
            <div className="space-y-3">
              {isLoadingActivity ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : loginActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent login activity found</p>
                  <p className="text-sm mt-1">Login events will appear here</p>
                </div>
              ) : (
                loginActivity.map((session, index) => (
                  <div
                    key={session.id || index}
                    className={`p-4 rounded-lg border ${
                      session.is_current
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(session.user_agent)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {session.device_name || 'Unknown Device'}
                            </p>
                            {session.is_current && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              {session.browser || 'Unknown Browser'}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {session.location || 'Unknown Location'}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(session.created_at)}
                            </div>
                          </div>
                          {session.ip_address && (
                            <div className="mt-1 text-xs text-gray-400">
                              IP: {session.ip_address} • {session.activity_type}
                            </div>
                          )}
                        </div>
                      </div>
                      {!session.is_current && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          End Session
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Security Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Security Tips:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Regularly review your login activity for suspicious sessions</li>
                <li>• End sessions on devices you no longer use</li>
                <li>• If you see unrecognized activity, change your password immediately</li>
                <li>• Use two-factor authentication for additional security</li>
                <li>• Always log out from shared or public computers</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySection;