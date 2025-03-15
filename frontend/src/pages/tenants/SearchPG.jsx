// import React, { useState } from 'react';
// import { Search, SlidersHorizontal } from 'lucide-react';
// import PropertyCard from '../components/PropertyCard';

// const properties = [
//   {
//     image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     title: "Sunshine PG Deluxe",
//     location: "Koramangala, Bangalore",
//     price: "₹15,000",
//     rating: "4.8",
//     amenities: ["wifi", "meals"],
//     type: "single"
//   },
//   {
//     image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     title: "Green View Residency",
//     location: "HSR Layout, Bangalore",
//     price: "₹12,000",
//     rating: "4.5",
//     amenities: ["wifi", "meals"],
//     type: "double"
//   },
//   {
//     image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     title: "City Living PG",
//     location: "Indiranagar, Bangalore",
//     price: "₹18,000",
//     rating: "4.9",
//     amenities: ["wifi"],
//     type: "single"
//   }
// ];

// function SearchPG() {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-4">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search by location, property name..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
//           <SlidersHorizontal className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {properties.map((property, index) => (
//           <PropertyCard key={index} {...property} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SearchPG;



import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';

function SearchPG() {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // TODO: Replace with actual tenant ID from auth context
        const tenantId = "dummy-tenant-id";
        const response = await axios.get(`http://localhost:5000/dashboard/tenant/${tenantId}/recommended`);
        setProperties(response.data.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location, property name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
}

export default SearchPG;
