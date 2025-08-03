import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { History, Clock, User, FileText } from 'lucide-react';

const ChangeLogsSection = () => {
  const { profileData, loading } = useProfile();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'create':
        return <User className="w-4 h-4 text-green-600" />;
      case 'update':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeDescription = (log) => {
    if (log.field_name === 'data_export') {
      return 'Profile data exported';
    }
    
    if (log.change_type === 'create') {
      return `Created ${log.field_name}`;
    }
    
    if (log.change_type === 'update') {
      return `Updated ${log.field_name}`;
    }
    
    if (log.change_type === 'delete') {
      return `Deleted ${log.field_name}`;
    }
    
    return `Modified ${log.field_name}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Profile Activity Log</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Activity Tracking</span>
        </div>
        <p className="text-sm text-blue-800">
          This log shows all changes made to your profile for security and compliance purposes. 
          Changes are automatically tracked and cannot be modified.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {profileData.changeLogs && profileData.changeLogs.length > 0 ? (
            profileData.changeLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getChangeIcon(log.change_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {getChangeDescription(log)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                  
                  {log.old_value && log.new_value && (
                    <div className="mt-2 text-xs text-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Previous:</span>
                          <span className="ml-1 text-red-600">{log.old_value}</span>
                        </div>
                        <div>
                          <span className="font-medium">New:</span>
                          <span className="ml-1 text-green-600">{log.new_value}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {log.ip_address && (
                    <p className="mt-1 text-xs text-gray-500">
                      IP: {log.ip_address}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No activity recorded yet.</p>
              <p className="text-sm">Profile changes will appear here when you make updates.</p>
            </div>
          )}
        </div>
      )}
      
      {profileData.changeLogs && profileData.changeLogs.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Showing recent activity. Older entries may be archived for compliance.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChangeLogsSection;