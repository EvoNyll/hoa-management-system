import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Home, Save, Loader, CheckCircle, AlertTriangle, Upload, X, Image } from 'lucide-react';

const ResidenceSection = () => {
  const { profileData, loading, updateResidenceInfo } = useProfile();
  const [formData, setFormData] = useState({
    block: '',
    lot: '',
    house_front_view: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('📊 Profile data received:', profileData);

    // Handle different possible data structures
    const residenceData = profileData?.residence || profileData?.basic || {};

    setFormData({
      block: residenceData.block || '',
      lot: residenceData.lot || '',
      house_front_view: null
    });

    // Set image preview if house_front_view exists
    if (residenceData.house_front_view) {
      setImagePreview(residenceData.house_front_view);
    }

    console.log('📝 Form data set:', {
      block: residenceData.block || '',
      lot: residenceData.lot || '',
      house_front_view: residenceData.house_front_view || null
    });
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(`📝 Field changed: ${name} = ${value}`);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, house_front_view: 'Please select a valid image file (JPG, PNG)' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, house_front_view: 'Image size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, house_front_view: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      // Clear any existing error
      if (errors.house_front_view) {
        setErrors(prev => ({ ...prev, house_front_view: null }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, house_front_view: null }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('house_front_view');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if we're updating existing residence data or uploading only a file
    const hasBlockLotData = formData.block?.trim() || formData.lot?.trim();
    const hasFileUpload = formData.house_front_view;

    // If user is providing block/lot data, both must be provided
    if (hasBlockLotData) {
      if (formData.block?.trim() && !formData.lot?.trim()) {
        newErrors.lot = 'Lot number is required when block is specified';
      }
      if (formData.lot?.trim() && !formData.block?.trim()) {
        newErrors.block = 'Block number is required when lot is specified';
      }
    }

    // Allow form submission if there's at least a file upload OR valid block/lot data
    if (!hasFileUpload && !hasBlockLotData) {
      newErrors.submit = 'Please provide either residence information (block and lot) or upload a house image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 Current form data:', formData);
    console.log('📋 formData.house_front_view type:', typeof formData.house_front_view);
    console.log('📋 formData.house_front_view instanceof File:', formData.house_front_view instanceof File);
    console.log('📋 formData.house_front_view value:', formData.house_front_view);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      let updateData;

      // Use FormData only if there's a file to upload
      if (formData.house_front_view) {
        updateData = new FormData();

        // Add text fields to FormData (allow empty strings)
        updateData.append('block', formData.block || '');
        updateData.append('lot', formData.lot || '');

        // Add image file
        updateData.append('house_front_view', formData.house_front_view);

        console.log('📤 Sending FormData with file:', {
          block: formData.block?.trim(),
          lot: formData.lot?.trim(),
          file: formData.house_front_view.name,
          fileType: formData.house_front_view.type,
          fileSize: formData.house_front_view.size
        });

        // Debug: Log all FormData entries
        console.log('📤 FormData entries:');
        for (let [key, value] of updateData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }
      } else {
        // Use regular object for text-only updates
        updateData = {};

        if (formData.block?.trim()) {
          updateData.block = formData.block.trim();
        }

        if (formData.lot?.trim()) {
          updateData.lot = formData.lot.trim();
        }

        console.log('📤 Sending JSON data:', updateData);
      }

      const result = await updateResidenceInfo(updateData);
      
      console.log('✅ Update successful:', result);
      
      setSuccessMessage('Residence information updated successfully!');
      
      // Auto-hide success message after 5 seconds
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
          console.log('🔥 Field errors:', fieldErrors);
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


  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 dark:text-green-400 mr-3" />
            <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 dark:text-red-400 mr-3" />
            <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Block Number */}
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Block Number *
            </label>
            <input
              type="text"
              id="block"
              name="block"
              value={formData.block}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.block ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., 1, A, Block 1"
              maxLength={20}
            />
            {errors.block && (
              <p className="mt-1 text-sm text-red-600">{errors.block}</p>
            )}
          </div>

          {/* Lot Number */}
          <div>
            <label htmlFor="lot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lot Number *
            </label>
            <input
              type="text"
              id="lot"
              name="lot"
              value={formData.lot}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.lot ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., 15, 28A, Lot 12"
              maxLength={20}
            />
            {errors.lot && (
              <p className="mt-1 text-sm text-red-600">{errors.lot}</p>
            )}
          </div>
        </div>

        {/* House Front View Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            House Front View
          </label>
          <div className="space-y-4">
            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="house_front_view"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> your house front view
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 5MB)</p>
                </div>
                <input
                  id="house_front_view"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="House front view preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.house_front_view && (
              <p className="text-sm text-red-600">{errors.house_front_view}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <Home className="w-5 h-5 text-blue-400 dark:text-blue-400 mr-3 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Residence Information</p>
              <p>
                Your block and lot numbers help us maintain accurate HOA records
                and ensure proper communication with residents. The house front view
                image is optional but helps with property identification for deliveries
                and community services.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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