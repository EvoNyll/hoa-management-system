// frontend/src/components/profile/PetsSection.jsx
import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Heart, Plus, Edit2, Trash2, Save, X, CheckCircle } from 'lucide-react';

const PetsSection = () => {
  const { profileData, loading, addPet, updatePet, deletePet } = useProfile();
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pet_type: 'dog',
    breed: '',
    color: '',
    weight: '',
    date_of_birth: '',
    microchip_number: '',
    vaccination_current: true,
    special_needs: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const petTypes = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'fish', label: 'Fish' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'reptile', label: 'Reptile' },
    { value: 'other', label: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      pet_type: 'dog',
      breed: '',
      color: '',
      weight: '',
      date_of_birth: '',
      microchip_number: '',
      vaccination_current: true,
      special_needs: ''
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
    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }
    if (!formData.pet_type) {
      newErrors.pet_type = 'Pet type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingPet) {
        await updatePet(editingPet.id, formData);
        setEditingPet(null);
      } else {
        await addPet(formData);
        setIsAddingPet(false);
      }
      resetForm();
    } catch (error) {
      console.error('Pet operation error:', error);
      setErrors({ general: 'Failed to save pet information. Please try again.' });
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name || '',
      pet_type: pet.pet_type || 'dog',
      breed: pet.breed || '',
      color: pet.color || '',
      weight: pet.weight || '',
      date_of_birth: pet.date_of_birth || '',
      microchip_number: pet.microchip_number || '',
      vaccination_current: pet.vaccination_current !== false,
      special_needs: pet.special_needs || ''
    });
    setEditingPet(pet);
    setIsAddingPet(false);
  };

  const handleDelete = async (id) => {
    try {
      await deletePet(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete pet error:', error);
    }
  };

  const handleCancel = () => {
    setIsAddingPet(false);
    setEditingPet(null);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pet Registration</h3>
        </div>
        
        {!isAddingPet && !editingPet && (
          <button
            onClick={() => setIsAddingPet(true)}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </button>
        )}
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <span className="text-red-800">{errors.general}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingPet || editingPet) && (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingPet ? 'Edit Pet Information' : 'Add New Pet'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Max, Fluffy"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Type *
                </label>
                <select
                  name="pet_type"
                  value={formData.pet_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.pet_type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {petTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.pet_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.pet_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Golden Retriever, Persian"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Brown, Black and White"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 15"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microchip Number
                </label>
                <input
                  type="text"
                  name="microchip_number"
                  value={formData.microchip_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="15-digit microchip ID"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="vaccination_current"
                  checked={formData.vaccination_current}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Vaccinations Current
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Needs
              </label>
              <textarea
                name="special_needs"
                value={formData.special_needs}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Any special care requirements, dietary restrictions, medications, etc."
              />
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
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingPet ? 'Update' : 'Add'} Pet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pets List */}
      <div className="space-y-4">
        {profileData.pets && profileData.pets.length > 0 ? (
          profileData.pets.map((pet) => (
            <div key={pet.id} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600">
                      {pet.breed ? `${pet.breed} ` : ''}{pet.pet_type}
                      {pet.color && ` • ${pet.color}`}
                      {pet.weight && ` • ${pet.weight} lbs`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {pet.vaccination_current ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Vaccinations Current
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Vaccinations Due
                        </span>
                      )}
                      {pet.microchip_number && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Microchipped
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-2 text-gray-400 hover:text-pink-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(pet.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {pet.special_needs && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Special Needs:</strong> {pet.special_needs}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No pets registered yet.</p>
            <p className="text-sm">Add your furry, feathered, or scaled family members.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Remove Pet</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this pet from your profile? This action cannot be undone.
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsSection;