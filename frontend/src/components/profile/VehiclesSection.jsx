// File: frontend/src/components/profile/VehiclesSection.jsx
// Location: frontend/src/components/profile/VehiclesSection.jsx

import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Car, Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Star, Ticket } from 'lucide-react';

const VehiclesSection = () => {
  const { profileData, loading, addVehicle, updateVehicle, deleteVehicle } = useProfile();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vehicle_type: 'car',
    is_primary: false,
    parking_permit_number: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'truck', label: 'Truck' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'rv', label: 'RV' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'other', label: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      license_plate: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vehicle_type: 'car',
      is_primary: false,
      parking_permit_number: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'License plate is required';
    } else if (!/^[A-Z0-9\-\s]{2,10}$/i.test(formData.license_plate.trim())) {
      newErrors.license_plate = 'Invalid license plate format';
    }
    
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVehicle = () => {
    setIsAddingVehicle(true);
    resetForm();
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle.id);
    setFormData({
      license_plate: vehicle.license_plate,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      vehicle_type: vehicle.vehicle_type,
      is_primary: vehicle.is_primary,
      parking_permit_number: vehicle.parking_permit_number || ''
    });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle, formData);
        setEditingVehicle(null);
      } else {
        await addVehicle(formData);
        setIsAddingVehicle(false);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleCancel = () => {
    setIsAddingVehicle(false);
    setEditingVehicle(null);
    resetForm();
  };

  const handleDelete = async (vehicleId) => {
    try {
      await deleteVehicle(vehicleId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case 'motorcycle':
        return '🏍️';
      case 'truck':
        return '🚚';
      case 'suv':
        return '🚙';
      case 'van':
        return '🚐';
      case 'rv':
        return '🚌';
      case 'trailer':
        return '🚛';
      default:
        return '🚗';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Registration</h2>
          <p className="text-gray-600 mt-1">
            Register your vehicles for parking permits and community records
          </p>
        </div>
        <button
          onClick={handleAddVehicle}
          disabled={loading || isAddingVehicle}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {isAddingVehicle && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Vehicle</h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-1">
                License Plate *
              </label>
              <input
                type="text"
                id="license_plate"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.license_plate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABC123"
              />
              {errors.license_plate && (
                <p className="mt-1 text-sm text-red-600">{errors.license_plate}</p>
              )}
            </div>

            <div>
              <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                Make *
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.make ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Toyota"
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">{errors.make}</p>
              )}
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.model ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Camry"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.year ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.color ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Silver"
              />
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="parking_permit_number" className="block text-sm font-medium text-gray-700 mb-1">
                Parking Permit Number
              </label>
              <input
                type="text"
                id="parking_permit_number"
                name="parking_permit_number"
                value={formData.parking_permit_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional parking permit number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Set as primary vehicle
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </div>
      )}

      {/* Vehicles List */}
      <div className="space-y-4">
        {profileData.vehicles && profileData.vehicles.length > 0 ? (
          profileData.vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {editingVehicle === vehicle.id ? (
                /* Edit Form */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Edit Vehicle</h3>
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit_license_plate" className="block text-sm font-medium text-gray-700 mb-1">
                        License Plate *
                      </label>
                      <input
                        type="text"
                        id="edit_license_plate"
                        name="license_plate"
                        value={formData.license_plate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.license_plate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.license_plate && (
                        <p className="mt-1 text-sm text-red-600">{errors.license_plate}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="edit_vehicle_type" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Type *
                      </label>
                      <select
                        id="edit_vehicle_type"
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {vehicleTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="edit_make" className="block text-sm font-medium text-gray-700 mb-1">
                        Make *
                      </label>
                      <input
                        type="text"
                        id="edit_make"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.make ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.make && (
                        <p className="mt-1 text-sm text-red-600">{errors.make}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="edit_model" className="block text-sm font-medium text-gray-700 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        id="edit_model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.model ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.model && (
                        <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="edit_year" className="block text-sm font-medium text-gray-700 mb-1">
                        Year *
                      </label>
                      <input
                        type="number"
                        id="edit_year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.year ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.year && (
                        <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="edit_color" className="block text-sm font-medium text-gray-700 mb-1">
                        Color *
                      </label>
                      <input
                        type="text"
                        id="edit_color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.color ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.color && (
                        <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="edit_parking_permit_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Parking Permit Number
                      </label>
                      <input
                        type="text"
                        id="edit_parking_permit_number"
                        name="parking_permit_number"
                        value={formData.parking_permit_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional parking permit number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_primary"
                          checked={formData.is_primary}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Set as primary vehicle
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {getVehicleTypeIcon(vehicle.vehicle_type)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          {vehicle.is_primary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">License Plate:</span> {vehicle.license_plate}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Color:</span> {vehicle.color}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {vehicleTypes.find(t => t.value === vehicle.vehicle_type)?.label}
                          </p>
                          {vehicle.parking_permit_number && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Parking Permit:</span> {vehicle.parking_permit_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit vehicle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No vehicles registered
            </h3>
            <p className="text-gray-600 mb-4">
              Register your vehicles for parking permits and community records.
            </p>
            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </button>
          </div>
        )}
      </div>

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
                      Delete Vehicle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vehicle? This action cannot be undone.
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
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesSection;