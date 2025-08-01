// File: frontend/src/components/profile/ChangeLogsSection.jsx
// Location: frontend/src/components/profile/ChangeLogsSection.jsx

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Shield, 
  Key, 
  Phone, 
  Mail, 
  Edit, 
  Plus, 
  Trash2,
  RefreshCw,
  ChevronDown,
  Clock
} from 'lucide-react';

const ChangeLogsSection = () => {
  const { profileData, loading, loadChangeLogs } = useProfile();
  const [changeLogs, setChangeLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const changeTypes = [
    { value: 'all', label: 'All Changes' },
    { value: 'create', label: 'Created' },
    { value: 'update', label: 'Updated' },
    { value: 'delete', label: 'Deleted' },
    { value: 'login', label: 'Login' },
    { value: 'password_change', label: 'Password Change' },
    { value: 'email_verification', label: 'Email Verification' },
    { value: 'phone_verification', label: 'Phone Verification' }
  ];

  const timePeriods = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  useEffect(() => {
    loadActivityLogs();
  }, []);

  useEffect(() => {
    filterAndSortLogs();
  }, [changeLogs, searchTerm, selectedType, selectedPeriod, sortOrder]);

  const loadActivityLogs = async () => {
    setIsLoading(true);
    try {
      const logs = await loadChangeLogs();
      setChangeLogs(logs || []);
    } catch (err) {
      console.error('Failed to load change logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortLogs = () => {
    let filtered = [...changeLogs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.field_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.change_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.old_value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.new_value?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by change type
    if (selectedType !== 'all') {
      filtered = filtered.filter(log => log.change_type === selectedType);
    }

    // Filter by time period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate);
    }

    // Sort by timestamp
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredLogs(filtered);
  };

  const getChangeTypeIcon = (changeType) => {
    switch (changeType) {
      case 'create': return <Plus className="w-4 h-4 text-green-500" />;
      case 'update': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'login': return <User className="w-4 h-4 text-purple-500" />;
      case 'password_change': return <Key className="w-4 h-4 text-orange-500" />;
      case 'email_verification': return <Mail className="w-4 h-4 text-green-500" />;
      case 'phone_verification': return <Phone className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeLabel = (changeType) => {
    const type = changeTypes.find(t => t.value === changeType);
    return type ? type.label : changeType;
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateValue = (value, maxLength = 50) => {
    if (!value) return '';
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedPeriod('all');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || selectedType !== 'all' || selectedPeriod !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity & Change Logs</h2>
          <p className="text-gray-600 mt-1">
            Track all changes and activities on your account for security and auditing
          </p>
        </div>
        <button
          onClick={loadActivityLogs}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activity logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Change Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {changeTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timePeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading activity logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">
            {changeLogs.length === 0 ? 'No activity recorded yet' : 'No activity matches your filters'}
          </p>
          <p className="text-sm text-gray-400">
            {changeLogs.length === 0 
              ? 'Profile changes and activities will appear here' 
              : 'Try adjusting your search criteria'}
          </p>
        </div>
      ) : (
        /* Activity Logs */
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getChangeTypeIcon(log.change_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {getChangeTypeLabel(log.change_type)}
                      </span>
                      {log.field_name && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {formatFieldName(log.field_name)}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Change Details */}
                    {(log.old_value || log.new_value) && log.change_type !== 'password_change' && (
                      <div className="mt-2 text-sm text-gray-600">
                        {log.change_type === 'update' && log.old_value && log.new_value ? (
                          <div className="space-y-1">
                            <div className="flex">
                              <span className="text-red-600 font-medium w-12">From:</span>
                              <span className="text-red-600">{truncateValue(log.old_value)}</span>
                            </div>
                            <div className="flex">
                              <span className="text-green-600 font-medium w-12">To:</span>
                              <span className="text-green-600">{truncateValue(log.new_value)}</span>
                            </div>
                          </div>
                        ) : log.change_type === 'create' && log.new_value ? (
                          <div className="flex">
                            <span className="text-green-600 font-medium mr-2">Added:</span>
                            <span className="text-green-600">{truncateValue(log.new_value)}</span>
                          </div>
                        ) : log.change_type === 'delete' && log.old_value ? (
                          <div className="flex">
                            <span className="text-red-600 font-medium mr-2">Removed:</span>
                            <span className="text-red-600">{truncateValue(log.old_value)}</span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {log.change_type === 'password_change' && (
                      <div className="mt-2 text-sm text-orange-600">
                        Password was changed for security
                      </div>
                    )}
                    
                    {/* Metadata */}
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                      
                      {log.ip_address && (
                        <div>
                          IP: {log.ip_address}
                        </div>
                      )}
                      
                      {log.user_agent && (
                        <div className="hidden md:block truncate max-w-xs">
                          {log.user_agent.includes('Chrome') ? '🌐 Chrome' :
                           log.user_agent.includes('Firefox') ? '🦊 Firefox' :
                           log.user_agent.includes('Safari') && !log.user_agent.includes('Chrome') ? '🧭 Safari' :
                           log.user_agent.includes('Edge') ? '🔷 Edge' : '💻 Browser'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="flex-shrink-0">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full mt-1"></div>
                    <div className="w-1 h-1 bg-current rounded-full mt-1"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Summary */}
      {changeLogs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Activity Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-blue-600 font-medium">Total Changes</div>
              <div className="text-blue-800">{changeLogs.length}</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">This Week</div>
              <div className="text-blue-800">
                {changeLogs.filter(log => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(log.timestamp) >= weekAgo;
                }).length}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Most Recent</div>
              <div className="text-blue-800">
                {changeLogs.length > 0 ? formatTimestamp(changeLogs[0]?.timestamp) : 'None'}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Account Age</div>
              <div className="text-blue-800">
                {profileData.basic?.created_at ? 
                  formatTimestamp(profileData.basic.created_at) : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeLogsSection;