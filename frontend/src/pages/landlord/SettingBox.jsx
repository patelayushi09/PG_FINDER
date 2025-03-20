import React from 'react';

const SettingBox = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-xl font-bold text-[#103538] mb-6">Account Settings</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-[#103538] mb-4">Profile Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <input
                type="text"
                defaultValue="Bangalore, India"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
              />
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-[#103538] mb-4">Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox text-[#D96851]" />
              <span>Email notifications for new bookings</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox text-[#D96851]" />
              <span>SMS alerts for urgent messages</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox text-[#D96851]" />
              <span>Monthly report summary</span>
            </label>
          </div>
        </div>
        <div className="pt-4 border-t">
          <button className="bg-[#D96851] text-white px-4 py-2 rounded-lg hover:bg-[#D96851]/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingBox;
