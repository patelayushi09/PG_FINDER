
import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard } from 'lucide-react';
import axios from 'axios';

function Settings() {
  const [tenant, setTenant] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneno: '',
    location: '',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    membershipType: 'Premium'
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    fetchTenantData();
  }, []);

  const fetchTenantData = async () => {
    try {
      // TODO: Replace with actual tenant ID from auth context
      const tenantId = "dummy-tenant-id";
      const response = await axios.get(`http://localhost:5000/tenant/${tenantId}`);
      const tenantData = response.data.data;
      
      setTenant(tenantData);
      setFormData({
        fullName: `${tenantData.firstName} ${tenantData.lastName}`,
        email: tenantData.email,
        phone: tenantData.phoneno,
        location: tenantData.location
      });
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // TODO: Replace with actual tenant ID from auth context
      const tenantId = "dummy-tenant-id";
      
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        firstName,
        lastName,
        email: formData.email,
        phoneno: formData.phone,
        location: formData.location
      };

      await axios.put(`http://localhost:5000/tenant/${tenantId}`, updateData);
      
      // Refresh tenant data
      await fetchTenantData();
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      // TODO: Replace with actual tenant ID from auth context
      const tenantId = "dummy-tenant-id";
      
      await axios.post(`http://localhost:5000/tenant/${tenantId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh tenant data
      await fetchTenantData();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#103538] mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img
                src={tenant.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <User className="w-4 h-4" />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#103538]">{formData.fullName}</h3>
              <p className="text-gray-500">{tenant.membershipType} Member</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#103538] mb-6">Account Settings</h2>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-[#D8B258] mr-3" />
              <span>Password & Security</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-[#D8B258] mr-3" />
              <span>Notifications</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-[#D8B258] mr-3" />
              <span>Payment Methods</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          onClick={fetchTenantData}
          className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-[#103538] text-white rounded-lg hover:bg-opacity-90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;