// File: frontend/src/components/profile/PetsSection.jsx
// Location: frontend/src/components/profile/PetsSection.jsx

import React, { useState, useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Heart, Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Camera, Shield } from 'lucide-react';

const PetsSection = () => {
  const { profileData, loading, addPet, updatePet, deletePet } = useProfile();
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pet_type: '',
    breed: '',
    color: '',
    weight: '',
    date_of_birth: '',
    microchip_number: '',
    vaccination_current: false,
    vaccination_expiry: '',
    special_needs: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const pets = profileData.pets || [];

  const petTypes = [
    { value: '', label: 'Select Pet Type', emoji: '🐾' },
    { value: 'dog', label: 'Dog', emoji: '🐕' },
    { value: 'cat', label: 'Cat', emoji: '🐱' },
    { value: 'bird', label: 'Bird', emoji: '🐦' },
    { value: 'fish', label: 'Fish', emoji: '🐟' },
    { value: 'reptile', label: 'Reptile', emoji: '🦎' },
    { value: 'small_mammal', label: 'Small Mammal', emoji: '🐹' },
    { value: 'other', label: 'Other', emoji: '🐾' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      pet_type: '',
      breed: '',
      color: '',
      weight: '',
      date_of_birth: '',
      microchip_number: '',
      vaccination_current: false,
      vaccination_expiry: '',
      special_needs: '',
      photo: null
    });
    setPhotoPreview(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
          return;
        }
        
        setFormData(prev => ({ ...prev, photo: file }));
        
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
        
        setErrors(prev => ({ ...prev, photo: null }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
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
    
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'photo' && formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          } else if (key === 'vaccination_current') {
            submitData.append(key, formData[key]);
          } else if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        }
      });

      if (editingPet) {
        await updatePet(editingPet, submitData);
        setSuccessMessage('Pet updated successfully!');
        setEditingPet(null);
      } else {
        await addPet(submitData);
        setSuccessMessage('Pet added successfully!');
        setIsAddingPet(false);
      }
      
      resetForm();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to save pet information. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet.id);
    setFormData({
      name: pet.name || '',
      pet_type: pet.pet_type || '',
      breed: pet.breed || '',
      color: pet.color || '',
      weight: pet.weight || '',
      date_of_birth: pet.date_of_birth || '',
      microchip_number: pet.microchip_number || '',
      vaccination_current: pet.vaccination_current || false,
      vaccination_expiry: pet.vaccination_expiry || '',
      special_needs: pet.special_needs || '',
      photo: null
    });
    setPhotoPreview(null);
    setIsAddingPet(false);
    setErrors({});
  };

  const handleCancel = () => {
    setIsAddingPet(false);
    setEditingPet(null);
    resetForm();
  };

  const handleDelete = async (petId) => {
    try {
      await deletePet(petId);
      setSuccessMessage('Pet removed successfully!');
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to remove pet. Please try again.' });
    }
  };

  const getPetEmoji = (petType) => {
    const type = petTypes.find(t => t.value === petType);
    return type ? type.emoji : '🐾';
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const ageInMonths = today.getMonth() - birth.getMonth();
    
    if (ageInYears < 1) {
      return `${ageInMonths + (ageInYears * 12)} months`;
    }
    return `${ageInYears} year${ageInYears > 1 ? 's' : ''}`;
  };

  const isVaccinationExpiring = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isVaccinationExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pet Registration</h2>
          <p className="text-gray-600 mt-1">
            Register your pets for HOA compliance and emergency situations
          </p>
        </div>
        
        {!isAddingPet && !editingPet && (
          <button
            onClick={() => setIsAddingPet(true)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingPet || editingPet) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {formData.pet_type ? getPetEmoji(formData.pet_type) : '🐾'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-orange-600 rounded-full text-white hover:bg-orange-700"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  name="photo"
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Upload a photo of your pet</p>
                <p className="text-xs text-gray-500 mt-1">Max 5MB. Formats: JPG, PNG, GIF</p>
                {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Buddy, Whiskers"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Pet Type */}
              <div>
                <label htmlFor="pet_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Type *
                </label>
                <select
                  id="pet_type"
                  name="pet_type"
                  value={formData.pet_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.pet_type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {petTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </option>
                  ))}
                </select>
                {errors.pet_type && <p className="text-xs text-red-600 mt-1">{errors.pet_type}</p>}
              </div>

              {/* Breed */}
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Golden Retriever, Persian"
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Brown, Black and White"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.weight ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 45.5"
                />
                {errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
              </div>

              {/* Date of Birth */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Microchip Number */}
              <div>
                <label htmlFor="microchip_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Microchip Number
                </label>
                <input
                  type="text"
                  id="microchip_number"
                  name="microchip_number"
                  value={formData.microchip_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 123456789012345"
                />
              </div>

              {/* Vaccination Expiry */}
              <div>
                <label htmlFor="vaccination_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Vaccination Expiry Date
                </label>
                <input
                  type="date"
                  id="vaccination_expiry"
                  name="vaccination_expiry"
                  value={formData.vaccination_expiry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Vaccination Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vaccination_current"
                  checked={formData.vaccination_current}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Vaccinations are up to date
                </span>
              </label>
            </div>

            {/* Special Needs */}
            <div>
              <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700 mb-1">
                Special Needs or Medical Conditions
              </label>
              <textarea
                id="special_needs"
                name="special_needs"
                value={formData.special_needs}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Any medical conditions, dietary restrictions, behavioral notes, or special care instructions..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingPet ? 'Update Pet' : 'Add Pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pets List */}
      {pets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pets registered</h3>
          <p className="text-gray-600 mb-4">Add your pets to help with HOA pet policies and emergency situations</p>
          <button
            onClick={() => setIsAddingPet(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {pet.photo ? (
                      <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {getPetEmoji(pet.pet_type)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{pet.pet_type}</p>
                    {pet.breed && <p className="text-xs text-gray-500">{pet.breed}</p>}
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Edit pet"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(pet.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove pet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pet Details */}
              <div className="space-y-2 text-xs text-gray-500">
                {pet.color && (
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
                    Color: {pet.color}
                  </div>
                )}
                
                {pet.weight && (
                  <div>📏 Weight: {pet.weight} lbs</div>
                )}
                
                {pet.date_of_birth && (
                  <div>🎂 Age: {calculateAge(pet.date_of_birth)}</div>
                )}
                
                {pet.microchip_number && (
                  <div>🏷️ Microchip: {pet.microchip_number}</div>
                )}
              </div>

              {/* Vaccination Status */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                {pet.vaccination_current ? (
                  <div className="flex items-center text-xs">
                    {isVaccinationExpired(pet.vaccination_expiry) ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-red-600">Vaccinations Expired</span>
                      </>
                    ) : isVaccinationExpiring(pet.vaccination_expiry) ? (
                      <>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-yellow-600">Vaccinations Expiring Soon</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600">Vaccinations Current</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <span className="text-gray-500">Vaccination status unknown</span>
                  </div>
                )}
                
                {pet.vaccination_expiry && (
                  <div className="text-xs text-gray-400 mt-1">
                    Expires: {new Date(pet.vaccination_expiry).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Special Needs */}
              {pet.special_needs && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start">
                    <Heart className="w-3 h-3 text-red-400 mr-1 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{pet.special_needs}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setDeleteConfirm(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Remove Pet
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this pet? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Removing...' : 'Remove'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-orange-400 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-orange-800">Pet Registration Information</h4>
            <ul className="mt-1 text-xs text-orange-700 space-y-1">
              <li>• Pet registration helps ensure compliance with HOA pet policies</li>
              <li>• Vaccination records may be required for certain community areas</li>
              <li>• Emergency contact information helps in case your pet gets lost</li>
              <li>• Keep vaccination records current to avoid any access restrictions</li>
              <li>• Special needs information helps staff provide appropriate care in emergencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsSection;