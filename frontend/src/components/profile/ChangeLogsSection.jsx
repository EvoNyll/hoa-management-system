// File: frontend/src/components/profile/ChangeLogsSection.jsx
// Location: frontend/src/components/profile/ChangeLogsSection.jsx

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { History, Calendar, User, Edit, Trash2, Plus, Lock, Mail, Phone, Loader, RefreshCw, Filter, Search } from 'lucide-react';

const ChangeLogsSection = () =            >
              {changeTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Period Filter */}
          <div>
            <label htmlFor="period-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              id="period-filter"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timePeriods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sort-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Sort
            </label>
            <select
              id="sort-filter"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading activity...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
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

      {/* Data Export */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Data Management</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(changeLogs, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = window.URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `profile-activity-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}
            className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Export Activity Log
          </button>
          <button
            onClick={() => window.print()}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Print Activity
          </button>
          <button
            onClick={() => {
              if (window.confirm('This will clear your search filters. Continue?')) {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedPeriod('all');
                setSortOrder('desc');
              }
            }}
            className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeLogsSection; {
  const { profileData, loading, loadChangeLogs } = useProfile();
  const [changeLogs, setChangeLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

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
      case 'create':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'login':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'password_change':
        return <Lock className="w-4 h-4 text-orange-500" />;
      case 'email_verification':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'phone_verification':
        return <Phone className="w-4 h-4 text-teal-500" />;
      default:
        return <History className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeLabel = (changeType) => {
    switch (changeType) {
      case 'create':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'login':
        return 'Login';
      case 'password_change':
        return 'Password Change';
      case 'email_verification':
        return 'Email Verification';
      case 'phone_verification':
        return 'Phone Verification';
      default:
        return changeType;
    }
  };

  const formatFieldName = (fieldName) => {
    if (!fieldName) return 'General';
    
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const truncateValue = (value, maxLength = 50) => {
    if (!value) return '-';
    if (value.length <= maxLength) return value;
    return `${value.substring(0, maxLength)}...`;
  };

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
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <History className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Profile Activity</h3>
          <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {filteredLogs.length} entries
          </span>
        </div>
        
        <button
          onClick={loadActivityLogs}
          disabled={isLoading}
          className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search activity..."
              />
            </div>
          </div>

          {/* Change Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"