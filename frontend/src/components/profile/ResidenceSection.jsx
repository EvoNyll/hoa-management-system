// frontend/src/components/profile/ResidenceSection.jsx - UPDATED VERSION
import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Home, Save, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

const ResidenceSection = () => {
  const { profileData, loading, updateResidenceInfo } = useProfile();
  const [formData, setFormData] = useState({
    unit_number: '',
    property_type: '',
    ...profileData.residence
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (profileData.residence) {
      setFormData(prev => ({
        ...prev,
        ...profileData.residence
      }));
    }
  }, [profileData.residence]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 🚫 FIX: Allow any case for unit number, no processing needed
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Unit number is required
    if (!formData.unit_number?.trim()) {
      newErrors.unit_number = 'Unit number is required';
    }

    // Property type is required
    if (!formData.property_type) {
      newErrors.property_type = 'Property type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      // 🚫 FIX: Only send the required fields
      const cleanData = {
        unit_number: formData.unit_number?.trim() || '',
        property_type: formData.property_type || '',
        // Remove the fields that are no longer needed
        move_in_date: null,
        parking_spaces: 0,
        mailbox_number: null
      };

      console.log('🔄 Sending residence data:', cleanData);
      
      await updateResidenceInfo(cleanData);
      setSuccessMessage('Residence information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('❌ Update residence error:', err);
      
      // Handle field-specific errors from backend
      if (err.response?.data) {
        const backendErrors = err.response.data;
        
        if (typeof backendErrors === 'object') {
          const fieldErrors = {};
          Object.keys(backendErrors).forEach(field => {
            if (Array.isArray(backendErrors[field])) {
              fieldErrors[field] = backendErrors[field][0];
            } else {
              fieldErrors[field] = backendErrors[field];
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: 'Failed to update residence information. Please try again.' });
        }
      } else {
        setErrors({ submit: err.message || 'Failed to update residence information' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚫 FIX: Updated property types as requested
  const propertyTypes = [
    { value: '', label: 'Select Property Type' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'single_attached', label: 'Single Attached' }
  ];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unit Number - No character limit, any case allowed */}
          <div>
            <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700 mb-2">
              Unit Number *
            </label>
            <input
              type="text"
              id="unit_number"
              name="unit_number"
              value={formData.unit_number || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.unit_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 101, A-204, Building 3 Unit 2B, etc."
            />
            {errors.unit_number && (
              <p className="mt-1 text-sm text-red-600">{errors.unit_number}</p>
            )}
          </div>

          {/* Property Type - Only Townhouse or Single Attached */}
          <div>
            <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.property_type ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.property_type && (
              <p className="mt-1 text-sm text-red-600">{errors.property_type}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <Home className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Residence Information</p>
              <p>
                Your unit number and property type help us maintain accurate HOA records 
                and ensure proper communication with residents. This information is required 
                for HOA dues and community notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResidenceSection;