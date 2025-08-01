// File: frontend/src/components/profile/EmergencySection.jsx
// Location: frontend/src/components/profile/EmergencySection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Phone, Heart, Shield, Save, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

const EmergencySection = () => {
  const { profileData, loading, updateEmergencyInfo } = useProfile();
  const [formData, setFormData] = useState({
    emergency_contact: '',
    emergency_phone: '',
    emergency_relationship: '',
    secondary_emergency_contact: '',
    secondary_emergency_phone: '',
    secondary_emergency_relationship: '',
    medical_conditions: '',
    special_needs: '',
    veterinarian_contact: '',
    insurance_company: '',
    insurance_policy_number: '',
    ...profileData.emergency
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (profileData.emergency) {
      setFormData(prev => ({
        ...prev,
        ...profileData.emergency
      }));
    }
  }, [profileData.emergency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate phone numbers if provided
    const phoneRegex = /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    
    if (formData.emergency_phone && !phoneRegex.test(formData.emergency_phone)) {
      newErrors.emergency_phone = 'Please enter a valid phone number';
    }

    if (formData.secondary_emergency_phone && !phoneRegex.test(formData.secondary_emergency_phone)) {
      newErrors.secondary_emergency_phone = 'Please enter a valid phone number';
    }

    // If emergency contact is provided, phone should be provided too
    if (formData.emergency_contact && !formData.emergency_phone) {
      newErrors.emergency_phone = 'Phone number is required when emergency contact is provided';
    }

    if (formData.secondary_emergency_contact && !formData.secondary_emergency_phone) {
      newErrors.secondary_emergency_phone = 'Phone number is required when secondary emergency contact is provided';
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
      await updateEmergencyInfo(formData);
      setSuccessMessage('Emergency information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update emergency information' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationshipOptions = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'relative', label: 'Other Relative' },
    { value: 'friend', label: 'Friend' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'coworker', label: 'Coworker' },
    { value: 'other', label: 'Other' }
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

      {/* Primary Emergency Contact */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Phone className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Primary Emergency Contact</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name of emergency contact"
            />
          </div>

          <div>
            <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="emergency_phone"
              name="emergency_phone"
              value={formData.emergency_phone || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.emergency_phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.emergency_phone && <p className="text-xs text-red-600 mt-1">{errors.emergency_phone}</p>}
          </div>

          <div>
            <label htmlFor="emergency_relationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              id="emergency_relationship"
              name="emergency_relationship"
              value={formData.emergency_relationship || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {relationshipOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Emergency Contact */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Phone className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Secondary Emergency Contact</h3>
          <span className="ml-2 text-sm text-gray-500">(Optional)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="secondary_emergency_contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="secondary_emergency_contact"
              name="secondary_emergency_contact"
              value={formData.secondary_emergency_contact || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name of secondary emergency contact"
            />
          </div>

          <div>
            <label htmlFor="secondary_emergency_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="secondary_emergency_phone"
              name="secondary_emergency_phone"
              value={formData.secondary_emergency_phone || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.secondary_emergency_phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.secondary_emergency_phone && <p className="text-xs text-red-600 mt-1">{errors.secondary_emergency_phone}</p>}
          </div>

          <div>
            <label htmlFor="secondary_emergency_relationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              id="secondary_emergency_relationship"
              name="secondary_emergency_relationship"
              value={formData.secondary_emergency_relationship || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {relationshipOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-4">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
          <span className="ml-2 text-sm text-gray-500">(Optional)</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700 mb-1">
              Medical Conditions
            </label>
            <textarea
              id="medical_conditions"
              name="medical_conditions"
              value={formData.medical_conditions || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any chronic conditions, allergies, medications, or medical information emergency responders should know..."
            />
          </div>

          <div>
            <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700 mb-1">
              Special Needs or Accessibility Requirements
            </label>
            <textarea
              id="special_needs"
              name="special_needs"
              value={formData.special_needs || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mobility assistance, communication needs, service animals, etc..."
            />
          </div>
        </div>
      </div>

      {/* Insurance & Professional Contacts */}
      <div>
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Insurance & Professional Contacts</h3>
          <span className="ml-2 text-sm text-gray-500">(Optional)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="insurance_company" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Company
            </label>
            <input
              type="text"
              id="insurance_company"
              name="insurance_company"
              value={formData.insurance_company || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Property insurance provider"
            />
          </div>

          <div>
            <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number
            </label>
            <input
              type="text"
              id="insurance_policy_number"
              name="insurance_policy_number"
              value={formData.insurance_policy_number || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Insurance policy number"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="veterinarian_contact" className="block text-sm font-medium text-gray-700 mb-1">
              Veterinarian Contact
            </label>
            <input
              type="text"
              id="veterinarian_contact"
              name="veterinarian_contact"
              value={formData.veterinarian_contact || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Veterinarian name and phone number (for pet emergencies)"
            />
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Privacy Notice</h4>
            <p className="mt-1 text-xs text-yellow-700">
              Emergency contact information will only be used in case of emergencies and will be accessible to HOA staff and emergency responders when necessary. Medical information is optional and confidential.
            </p>
          </div>
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
          {isSubmitting ? 'Saving...' : 'Save Emergency Information'}
        </button>
      </div>
    </form>
  );
};

export default EmergencySection;