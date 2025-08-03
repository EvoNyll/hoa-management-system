import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Phone, Save, Loader, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';

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
    insurance_policy_number: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('📊 Emergency data received:', profileData);
    
    // Handle different possible data structures
    const emergencyData = profileData?.emergency || profileData?.basic || {};
    
    setFormData({
      emergency_contact: emergencyData.emergency_contact || '',
      emergency_phone: emergencyData.emergency_phone || '',
      emergency_relationship: emergencyData.emergency_relationship || '',
      secondary_emergency_contact: emergencyData.secondary_emergency_contact || '',
      secondary_emergency_phone: emergencyData.secondary_emergency_phone || '',
      secondary_emergency_relationship: emergencyData.secondary_emergency_relationship || '',
      medical_conditions: emergencyData.medical_conditions || '',
      special_needs: emergencyData.special_needs || '',
      veterinarian_contact: emergencyData.veterinarian_contact || '',
      insurance_company: emergencyData.insurance_company || '',
      insurance_policy_number: emergencyData.insurance_policy_number || ''
    });
    
    console.log('📝 Emergency form data set:', emergencyData);
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    console.log(`📝 Emergency field changed: ${name} = ${value}`);
    
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

    // At least primary emergency contact name is recommended
    if (!formData.emergency_contact?.trim()) {
      newErrors.emergency_contact = 'Primary emergency contact name is recommended';
    }

    // If emergency contact is provided, phone should be provided too
    if (formData.emergency_contact?.trim() && !formData.emergency_phone?.trim()) {
      newErrors.emergency_phone = 'Emergency contact phone is required when contact name is provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Emergency form submission started');
    console.log('📋 Current emergency form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Emergency form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      // 🔧 FIX: Send only the fields that exist in backend
      const updateData = {};
      
      // Only include fields that have values or are part of the backend serializer
      Object.keys(formData).forEach(key => {
        updateData[key] = formData[key] || '';
      });

      console.log('📤 Sending emergency update data:', updateData);
      
      const result = await updateEmergencyInfo(updateData);
      
      console.log('✅ Emergency update successful:', result);
      
      setSuccessMessage('Emergency information updated successfully!');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err) {
      console.error('❌ Update emergency info error:', err);
      
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
          console.log('🔥 Emergency field errors:', fieldErrors);
        } else {
          setErrors({ submit: 'Failed to update emergency information. Please try again.' });
        }
      } else {
        setErrors({ submit: err.message || 'Failed to update emergency information' });
      }
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
    { value: 'friend', label: 'Friend' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'other', label: 'Other' }
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
        {/* Primary Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5 text-red-600" />
            <h4 className="text-lg font-medium text-gray-900">Primary Emergency Contact</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.emergency_contact ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John Smith"
              />
              {errors.emergency_contact && (
                <p className="mt-1 text-sm text-red-600">{errors.emergency_contact}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="emergency_phone"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.emergency_phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="(555) 123-4567"
              />
              {errors.emergency_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergency_phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergency_relationship" className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <select
                id="emergency_relationship"
                name="emergency_relationship"
                value={formData.emergency_relationship}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-medium text-gray-900">Secondary Emergency Contact</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="secondary_emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="secondary_emergency_contact"
                name="secondary_emergency_contact"
                value={formData.secondary_emergency_contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="secondary_emergency_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="secondary_emergency_phone"
                name="secondary_emergency_phone"
                value={formData.secondary_emergency_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="(555) 987-6543"
              />
            </div>

            <div>
              <label htmlFor="secondary_emergency_relationship" className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <select
                id="secondary_emergency_relationship"
                name="secondary_emergency_relationship"
                value={formData.secondary_emergency_relationship}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                id="medical_conditions"
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any medical conditions, allergies, or important medical information..."
              />
            </div>

            <div>
              <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700 mb-2">
                Special Needs / Accessibility
              </label>
              <textarea
                id="special_needs"
                name="special_needs"
                value={formData.special_needs}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special needs, mobility requirements, or accessibility considerations..."
              />
            </div>
          </div>
        </div>

        {/* Insurance & Services */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Insurance & Services</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="insurance_company" className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Company
              </label>
              <input
                type="text"
                id="insurance_company"
                name="insurance_company"
                value={formData.insurance_company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Blue Cross Blue Shield"
              />
            </div>

            <div>
              <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number
              </label>
              <input
                type="text"
                id="insurance_policy_number"
                name="insurance_policy_number"
                value={formData.insurance_policy_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC123456789"
              />
            </div>

            <div>
              <label htmlFor="veterinarian_contact" className="block text-sm font-medium text-gray-700 mb-2">
                Veterinarian Contact
              </label>
              <input
                type="text"
                id="veterinarian_contact"
                name="veterinarian_contact"
                value={formData.veterinarian_contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. Smith - (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">Emergency Contact Information</p>
              <p>
                This information is crucial for emergency situations. Please ensure your emergency 
                contacts are aware they've been listed and keep this information up to date.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default EmergencySection;