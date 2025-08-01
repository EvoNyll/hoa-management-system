// File: frontend/src/components/profile/ResidenceSection.jsx
// Location: frontend/src/components/profile/ResidenceSection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Home, Save, Loader, CheckCircle } from 'lucide-react';

const ResidenceSection = () => {
  const { profileData, loading, updateResidenceInfo } = useProfile();
  const [formData, setFormData] = useState({
    unit_number: '',
    move_in_date: '',
    property_type: '',
    parking_spaces: 0,
    mailbox_number: '',
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.unit_number?.trim()) {
      newErrors.unit_number = 'Unit number is required';
    }

    if (formData.parking_spaces < 0) {
      newErrors.parking_spaces = 'Parking spaces cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await updateResidenceInfo(formData);
      setSuccessMessage('Residence information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update residence information' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = [
    { value: '', label: 'Select Property Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'single_family', label: 'Single Family Home' },
    { value: 'condo', label: 'Condominium' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Number *
          </label>
          <input
            type="text"
            id="unit_number"
            name="unit_number"
            value={formData.unit_number || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.unit_number ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 101, A-25, Building 3 Unit 4"
          />
          {errors.unit_number && <p className="text-xs text-red-600 mt-1">{errors.unit_number}</p>}
        </div>

        <div>
          <label htmlFor="move_in_date" className="block text-sm font-medium text-gray-700 mb-1">
            Move-in Date
          </label>
          <input
            type="date"
            id="move_in_date"
            name="move_in_date"
            value={formData.move_in_date || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="property_type"
            name="property_type"
            value={formData.property_type || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="parking_spaces" className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Parking Spaces
          </label>
          <input
            type="number"
            id="parking_spaces"
            name="parking_spaces"
            value={formData.parking_spaces || 0}
            onChange={handleInputChange}
            min="0"
            max="10"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.parking_spaces ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.parking_spaces && <p className="text-xs text-red-600 mt-1">{errors.parking_spaces}</p>}
        </div>

        <div>
          <label htmlFor="mailbox_number" className="block text-sm font-medium text-gray-700 mb-1">
            Mailbox Number
          </label>
          <input
            type="text"
            id="mailbox_number"
            name="mailbox_number"
            value={formData.mailbox_number || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 101, MB-25"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default ResidenceSection;