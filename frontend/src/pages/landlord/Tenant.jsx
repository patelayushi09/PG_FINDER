import React from 'react';
import { Users, Phone, Mail } from 'lucide-react';

const Tenant = () => {
  const tenants = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      room: '201',
      property: 'Sunshine PG',
      joinDate: '2023-10-15',
      contact: '+91 98765 43210',
    },
    {
      id: 2,
      name: 'Sneha Sharma',
      room: '102',
      property: 'Green Valley PG',
      joinDate: '2023-11-01',
      contact: '+91 98765 43211',
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-xl font-bold text-[#103538] mb-6">Current Tenants</h3>
      <div className="space-y-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="p-6 rounded-2xl shadow-md border border-gray-200 bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-[#103538] text-lg">{tenant.name}</h4>
                <p className="text-sm text-gray-600">{tenant.property} - Room {tenant.room}</p>
                <div className="mt-3 flex space-x-6">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone size={16} className="mr-2 text-[#D96851]" /> {tenant.contact}
                  </p>
                  <p className="text-sm text-gray-600">Joined: {tenant.joinDate}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 text-[#759B87] hover:bg-[#759B87]/10 rounded-full transition">
                  <Mail size={22} />
                </button>
                <button className="p-2 text-[#D96851] hover:bg-[#D96851]/10 rounded-full transition">
                  <Phone size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tenant;
