// File: frontend/src/components/profile/PetsSection.jsx
// Location: frontend/src/components/profile/PetsSection.jsx

import React, { useState, useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { PawPrint, Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Camera, Heart, Shield } from 'lucide-react';

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
  const fileInputRef = useRef(null);

  const pets = profileData.pets || [];

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
        // Validate file
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
          return;
        }
        
        setFormData(prev => ({ ...prev, photo: file }));
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
        
        // Clear photo error
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

    if (!formData.name?.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (!formData.pet_type) {
      newErrors.pet_type = 'Pet type is required';
    }

    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }

    if (formData.vaccination_expiry) {
      const expiryDate = new Date(formData.vaccination_expiry);
      const today = new Date();
      if (expiryDate < today) {
        setFormData(prev => ({ ...prev, vaccination_current: false }));
      }
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
      if (editingPet) {
        await updatePet(editingPet.id, formData);
        setSuccessMessage('Pet information updated successfully!');
        setEditingPet(null);
      } else {
        await addPet(formData);
        setSuccessMessage('Pet added successfully!');
        setIsAddingPet(false);
      }
      
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save pet information' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name,
      pet_type: pet.pet_type,
      breed: pet.breed || '',
      color: pet.color || '',
      weight: pet.weight || '',
      date_of_birth: pet.date_of_birth || '',
      microchip_number: pet.microchip_number || '',
      vaccination_current: pet.vaccination_current,
      vaccination_expiry: pet.vaccination_expiry || '',
      special_needs: pet.special_needs || '',
      photo: null
    });
    setPhotoPreview(pet.photo || null);
    setEditingPet(pet);
    setIsAddingPet(false);
  };

  const handleDelete = async (petId) => {
    if (!window.confirm('Are you sure you want to remove this pet?')) {
      return;
    }

    try {
      await deletePet(petId);
      setSuccessMessage('Pet removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to remove pet' });
    }
  };

  const handleCancel = () => {
    setIsAddingPet(false);
    setEditingPet(null);
    resetForm();
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const petTypes = [
    { value: '', label: 'Select Pet Type', emoji: '' },
    { value: 'dog', label: 'Dog', emoji: '🐕' },
    { value: 'cat', label: 'Cat', emoji: '🐱' },
    { value: 'bird', label: 'Bird', emoji: '🦜' },
    { value: 'fish', label: 'Fish', emoji: '🐠' },
    { value: 'reptile', label: 'Reptile', emoji: '🦎' },
    { value: 'small_mammal', label: 'Small Mammal', emoji: '🐹' },
    { value: 'other', label: 'Other', emoji: '🐾' }
  ];

  const getPetEmoji = (type) => {
    const petType = petTypes.find(t => t.value === type);
    return petType ? petType.emoji : '🐾';
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
          <PawPrint className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Pet Registration</h3>
          <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            {pets.length}
          </span>
        </div>
        
        {!isAddingPet && !editingPet && (
          <button
            onClick={() => setIsAddingPet(true)}
            className="flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Pet
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingPet || editingPet) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              {editingPet ? 'Edit Pet Information' : 'Add New Pet'}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pet Photo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Pet preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  name="photo"
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500 mt-1">
                  Max 5MB. JPEG, PNG, GIF, WebP
                </p>
                
                {errors.photo && (
                  <p className="text-xs text-red-600 mt-1">{errors.photo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Enter pet's name"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

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
                  placeholder="0.0"
                />
                {errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

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
                  placeholder="15-digit microchip ID"
                />
              </div>

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

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="vaccination_current"
                  name="vaccination_current"
                  type="checkbox"
                  checked={formData.vaccination_current}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="vaccination_current" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  Vaccinations are current and up to date
                </label>
              </div>
            </div>

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
                className="flex items-center px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No pets registered yet</p>
          <p className="text-sm text-gray-400">Add your pets to help with HOA pet policies and emergency situations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {pet.photo ? (
                      <img
                        src={pet.photo}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {getPetEmoji(pet.pet_type)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{pet.pet_type}</p>
                    {pet.breed && (
                      <p className="text-xs text-gray-500">{pet.breed}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-1 text-gray-400 hover:text-orange-600"
                    title="Edit pet"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Remove pet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

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

              {pet.special_needs && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start">
                    <Heart className="w-3 h-3 text-red-400 mr-1 mt-0.5" />
                    <p className="text-xs text-gray-600 line-clamp-2">{pet.special_needs}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
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