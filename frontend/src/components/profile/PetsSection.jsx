import React, { useState, useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Heart, Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Camera, Upload } from 'lucide-react';

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
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
          return;
        }
        
        setFormData(prev => ({ ...prev, photo: file }));
        
        // Create preview
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
    
    // Validate weight if provided
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }

    // Validate dates
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_of_birth = 'Birth date cannot be in the future';
      }
    }

    if (formData.vaccination_expiry && formData.vaccination_expiry < new Date().toISOString().split('T')[0]) {
      newErrors.vaccination_expiry = 'Vaccination expiry date should be in the future';
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
      let submitData;
      const hasPhoto = formData.photo && formData.photo instanceof File;

      console.log('[PET DEBUG] Photo check:', {
        hasPhoto: hasPhoto,
        photoType: typeof formData.photo,
        photoInstanceOf: formData.photo instanceof File,
        photoValue: formData.photo
      });

      if (hasPhoto) {
        // Use FormData for file uploads
        console.log('[PET DEBUG] Using FormData for file upload');
        submitData = new FormData();

        // Add all fields to FormData
        Object.keys(formData).forEach(key => {
          const value = formData[key];

          if (value !== null && value !== '') {
            if (key === 'photo' && value instanceof File) {
              submitData.append(key, value);
            } else if (key === 'vaccination_current') {
              submitData.append(key, value);
            } else if (key === 'weight' && value) {
              // Ensure weight is a valid decimal
              submitData.append(key, parseFloat(value));
            } else if (value) {
              submitData.append(key, value);
            }
          }
        });
      } else {
        // Use JSON for regular data (no file upload)
        console.log('[PET DEBUG] Using JSON for data only');
        submitData = {
          name: formData.name.trim(),
          pet_type: formData.pet_type,
          breed: formData.breed?.trim() || null,
          color: formData.color?.trim() || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          date_of_birth: formData.date_of_birth || null,
          microchip_number: formData.microchip_number?.trim() || null,
          vaccination_current: formData.vaccination_current,
          vaccination_expiry: formData.vaccination_expiry || null,
          special_needs: formData.special_needs?.trim() || null
        };

        // Remove null values for optional fields
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === null || submitData[key] === '') {
            if (key !== 'name' && key !== 'pet_type' && key !== 'vaccination_current') {
              delete submitData[key];
            }
          }
        });
      }

      console.log('[PET DEBUG] Final submitData:', submitData instanceof FormData ? 'FormData' : submitData);

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
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('❌ Pet submit error:', error);
      
      if (error.response?.data) {
        const backendErrors = error.response.data;
        
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
          setErrors({ submit: 'Failed to save pet information. Please try again.' });
        }
      } else {
        setErrors({ submit: error.message || 'Failed to save pet information. Please try again.' });
      }
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
    setPhotoPreview(pet.photo || null);
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
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('❌ Delete pet error:', error);
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

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pet Registration</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Register your pets for HOA compliance and emergency situations
          </p>
        </div>
        
        {!isAddingPet && !editingPet && (
          <button
            onClick={() => setIsAddingPet(true)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingPet || editingPet) && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingPet ? 'Edit Pet Information' : 'Add New Pet'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Pet preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleInputChange}
                  name="photo"
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                </p>
                {errors.photo && (
                  <p className="text-xs text-red-600 mt-1">{errors.photo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., Buddy, Whiskers, Tweety"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Pet Type */}
              <div>
                <label htmlFor="pet_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pet Type *
                </label>
                <select
                  id="pet_type"
                  name="pet_type"
                  value={formData.pet_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.pet_type ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {petTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </option>
                  ))}
                </select>
                {errors.pet_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.pet_type}</p>
                )}
              </div>

              {/* Breed */}
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="form-select"
                  placeholder="e.g., Golden Retriever, Persian"
                  maxLength={100}
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="form-select"
                  placeholder="e.g., Brown, Black and White"
                  maxLength={50}
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  max="999"
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.weight ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., 15.5"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.date_of_birth ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                )}
              </div>

              {/* Microchip Number */}
              <div>
                <label htmlFor="microchip_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Microchip Number
                </label>
                <input
                  type="text"
                  id="microchip_number"
                  name="microchip_number"
                  value={formData.microchip_number}
                  onChange={handleInputChange}
                  className="form-select"
                  placeholder="15-digit microchip ID"
                  maxLength={50}
                />
              </div>

              {/* Vaccination Expiry */}
              <div>
                <label htmlFor="vaccination_expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vaccination Expiry
                </label>
                <input
                  type="date"
                  id="vaccination_expiry"
                  name="vaccination_expiry"
                  value={formData.vaccination_expiry}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.vaccination_expiry ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.vaccination_expiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.vaccination_expiry}</p>
                )}
              </div>
            </div>

            {/* Vaccination Current */}
            <div className="flex items-center">
              <label htmlFor="vaccination_current" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="vaccination_current"
                  name="vaccination_current"
                  checked={formData.vaccination_current}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600 dark:peer-checked:bg-pink-500"></div>
              </label>
              <label htmlFor="vaccination_current" className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Vaccinations are current
              </label>
            </div>

            {/* Special Needs */}
            <div>
              <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Needs
              </label>
              <textarea
                id="special_needs"
                name="special_needs"
                value={formData.special_needs}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Any special care requirements, dietary restrictions, medications, etc."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : (editingPet ? 'Update Pet' : 'Add Pet')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pets List */}
      <div className="space-y-4">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                    {pet.photo ? (
                      <img 
                        src={pet.photo} 
                        alt={pet.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">{getPetEmoji(pet.pet_type)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{pet.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {pet.breed ? `${pet.breed} ` : ''}{petTypes.find(t => t.value === pet.pet_type)?.label}
                      {pet.color && ` • ${pet.color}`}
                      {pet.weight && ` • ${pet.weight} lbs`}
                    </p>
                    {pet.date_of_birth && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Age: {calculateAge(pet.date_of_birth)}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {pet.vaccination_current ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                          Vaccinations Current
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
                          Vaccinations Needed
                        </span>
                      )}
                      {pet.microchip_number && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                          Microchipped
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(pet.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {pet.special_needs && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Special Needs:</strong> {pet.special_needs}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pets registered yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your furry, feathered, or scaled family members to your profile.</p>
            <button
              onClick={() => setIsAddingPet(true)}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Pet
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Remove Pet</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to remove this pet from your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsSection;