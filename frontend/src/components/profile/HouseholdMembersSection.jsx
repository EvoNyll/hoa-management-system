// File: frontend/src/components/profile/HouseholdMembersSection.jsx
// Location: frontend/src/components/profile/HouseholdMembersSection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Users, Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Phone, Mail, Key, Heart } from 'lucide-react';

const HouseholdMembersSection = () => {
  const { profileData, loading, addHouseholdMember, updateHouseholdMember, deleteHouseholdMember } = useProfile();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    relationship: '',
    date_of_birth: '',
    phone: '',
    email: '',
    emergency_contact: false,
    has_key_access: false,
    is_minor: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const householdMembers = profileData.householdMembers || [];

  const resetForm = () => {
    setFormData({
      full_name: '',
      relationship: '',
      date_of_birth: '',
      phone: '',
      email: '',
      emergency_contact: false,
      has_key_access: false,
      is_minor: false
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required';
    }

    if (formData.phone && !/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // Auto-set is_minor based on age
      setFormData(prev => ({ ...prev, is_minor: age < 18 }));
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
      if (editingMember) {
        await updateHouseholdMember(editingMember.id, formData);
        setSuccessMessage('Household member updated successfully!');
        setEditingMember(null);
      } else {
        await addHouseholdMember(formData);
        setSuccessMessage('Household member added successfully!');
        setIsAddingMember(false);
      }
      
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save household member' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      full_name: member.full_name,
      relationship: member.relationship,
      date_of_birth: member.date_of_birth || '',
      phone: member.phone || '',
      email: member.email || '',
      emergency_contact: member.emergency_contact,
      has_key_access: member.has_key_access,
      is_minor: member.is_minor
    });
    setEditingMember(member);
    setIsAddingMember(false);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this household member?')) {
      return;
    }

    try {
      await deleteHouseholdMember(memberId);
      setSuccessMessage('Household member removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to remove household member' });
    }
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingMember(null);
    resetForm();
  };

  const relationshipOptions = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'relative', label: 'Other Relative' },
    { value: 'roommate', label: 'Roommate' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'other', label: 'Other' }
  ];

  const getRelationshipIcon = (relationship) => {
    switch (relationship) {
      case 'spouse': return '💑';
      case 'child': return '👶';
      case 'parent': return '👨‍👩‍👦';
      case 'sibling': return '👫';
      case 'relative': return '👨‍👩‍👧‍👦';
      case 'roommate': return '🏠';
      case 'tenant': return '🏘️';
      default: return '👤';
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Household Members</h3>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {householdMembers.length}
          </span>
        </div>
        
        {!isAddingMember && !editingMember && (
          <button
            onClick={() => setIsAddingMember(true)}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingMember || editingMember) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              {editingMember ? 'Edit Household Member' : 'Add Household Member'}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.full_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.relationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {relationshipOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.relationship && <p className="text-xs text-red-600 mt-1">{errors.relationship}</p>}
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="emergency_contact"
                  name="emergency_contact"
                  type="checkbox"
                  checked={formData.emergency_contact}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="emergency_contact" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-1" />
                  Emergency Contact (can be reached in case of emergency)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="has_key_access"
                  name="has_key_access"
                  type="checkbox"
                  checked={formData.has_key_access}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="has_key_access" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Key className="w-4 h-4 text-yellow-500 mr-1" />
                  Has Key Access (authorized to access the unit)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="is_minor"
                  name="is_minor"
                  type="checkbox"
                  checked={formData.is_minor}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_minor" className="ml-2 text-sm text-gray-700">
                  Minor (under 18 years old)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      {householdMembers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No household members added yet</p>
          <p className="text-sm text-gray-400">Add family members, roommates, or other residents of your unit</p>
        </div>
      ) : (
        <div className="space-y-3">
          {householdMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getRelationshipIcon(member.relationship)}</div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      {member.full_name}
                      {member.is_minor && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Minor</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">{member.relationship}</p>
                    {member.date_of_birth && (
                      <p className="text-xs text-gray-500">
                        Born: {new Date(member.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Contact info */}
                  <div className="flex space-x-1">
                    {member.phone && (
                      <div className="text-green-500" title="Has phone">
                        <Phone className="w-4 h-4" />
                      </div>
                    )}
                    {member.email && (
                      <div className="text-blue-500" title="Has email">
                        <Mail className="w-4 h-4" />
                      </div>
                    )}
                    {member.emergency_contact && (
                      <div className="text-red-500" title="Emergency contact">
                        <Heart className="w-4 h-4" />
                      </div>
                    )}
                    {member.has_key_access && (
                      <div className="text-yellow-500" title="Has key access">
                        <Key className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit member"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(member.phone || member.email) && (
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  {member.phone && <div>📞 {member.phone}</div>}
                  {member.email && <div>📧 {member.email}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Important Information</h4>
            <ul className="mt-1 text-xs text-blue-700 space-y-1">
              <li>• Household members help HOA staff know who lives in your unit</li>
              <li>• Emergency contacts will be notified in case of emergencies</li>
              <li>• Key access indicates who is authorized to enter the unit</li>
              <li>• This information is kept confidential and used only for safety and communication</li>
              <li>• Minors under 18 are automatically flagged for safety protocols</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdMembersSection;