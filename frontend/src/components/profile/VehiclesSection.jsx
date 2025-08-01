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
    year: