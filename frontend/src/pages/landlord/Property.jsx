import React from 'react';
import { Home, Search, Filter, MapPin, Edit, Trash2 } from 'lucide-react';

const Property = () => {
  const properties = [
    {
      id: 1,
      name: 'Sunshine PG',
      location: 'Koramangala, Bangalore',
      occupancy: '85%',
      revenue: '₹45,000',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3'
    },
    {
      id: 2,
      name: 'Green Valley PG',
      location: 'HSR Layout, Bangalore',
      occupancy: '92%',
      revenue: '₹41,000',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3'
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#103538]">Property Management</h3>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="flex items-center space-x-2 bg-[#D96851] text-white px-4 py-2 rounded-lg hover:bg-[#D96851]/90">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className={`flex justify-between items-center p-4 rounded-lg border shadow-md ${
              index % 2 === 0 ? 'bg-[#f9f9f6]' : 'bg-[#fdf8f0]' // Alternating light backgrounds
            }`}
          >
            <div className="flex space-x-4">
              <img
                src={property.image}
                alt={property.name}
                className="w-32 h-24 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-[#103538]">{property.name}</h4>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin size={16} className="mr-1" /> {property.location}
                </p>
                <div className="mt-2 flex space-x-4">
                  <div>
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="font-semibold text-[#D96851]">{property.occupancy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="font-semibold text-[#D8B258]">{property.revenue}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-[#759B87] hover:bg-[#759B87]/10 rounded-lg">
                <Edit size={20} />
              </button>
              <button className="p-2 text-[#D96851] hover:bg-[#D96851]/10 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Property;
