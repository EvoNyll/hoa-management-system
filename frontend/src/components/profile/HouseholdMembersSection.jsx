import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Users, Plus, Edit2, Trash2, Save, X, CheckCircle, User } from 'lucide-react';

const HouseholdMembersSection = () => {
  const { profileData, loading, addHouseholdMember, updateHouseholdMember, deleteHouseholdMember } = useProfile();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    relationship: '',
    date_of_birth: '',
    contact_phone: '',
    email: '',
    is_emergency_contact: false
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const relationships = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'partner', label: 'Partner' },
    { value: 'roommate', label: 'Roommate' },
    { value: 'other', label: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      full_name: '',
      relationship: '',
      date_of_birth: '',
      contact_phone: '',
      email: '',
      is_emergency_contact: false
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
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingMember) {
        await updateHouseholdMember(editingMember.id, formData);
        setEditingMember(null);
      } else {
        await addHouseholdMember(formData);
        setIsAddingMember(false);
      }
      resetForm();
    } catch (error) {
      console.error('Household member operation error:', error);
      setErrors({ general: 'Failed to save household member. Please try again.' });
    }
  };

  const handleEdit = (member) => {
    setFormData({
      full_name: member.full_name || '',
      relationship: member.relationship || '',
      date_of_birth: member.date_of_birth || '',
      contact_phone: member.contact_phone || '',
      email: member.email || '',
      is_emergency_contact: member.is_emergency_contact || false
    });
    setEditingMember(member);
    setIsAddingMember(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHouseholdMember(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete household member error:', error);
    }
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingMember(null);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Household Members</h3>
        </div>
        
        {!isAddingMember && !editingMember && (
          <button
            onClick={() => setIsAddingMember(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        )}
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <span className="text-red-800">{errors.general}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingMember || editingMember) && (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingMember ? 'Edit Household Member' : 'Add New Household Member'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.full_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.relationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel.value} value={rel.value}>{rel.label}</option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_emergency_contact"
                  checked={formData.is_emergency_contact}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Emergency Contact
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingMember ? 'Update' : 'Add'} Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-4">
        {profileData.household && profileData.household.length > 0 ? (
          profileData.household.map((member) => (
            <div key={member.id} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{member.full_name}</h4>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    {member.is_emergency_contact && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Emergency Contact
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {member.contact_phone && (
                <p className="mt-2 text-sm text-gray-600">Phone: {member.contact_phone}</p>
              )}
              {member.email && (
                <p className="text-sm text-gray-600">Email: {member.email}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No household members added yet.</p>
            <p className="text-sm">Add family members, roommates, or other residents.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Household Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this household member? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdMembersSection;