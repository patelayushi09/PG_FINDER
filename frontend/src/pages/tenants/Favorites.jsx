// import React from 'react';
// import PropertyCard from '../components/PropertyCard';

// const favoriteProperties = [
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
//   }
// ];

// function Favorites() {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {favoriteProperties.map((property, index) => (
//           <PropertyCard key={index} {...property} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Favorites;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';

function Favorites() {
  const [favoriteProperties, setFavoriteProperties] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // TODO: Replace with actual tenant ID from auth context
        const tenantId = "dummy-tenant-id";
        const response = await axios.get(`http://localhost:5000/favorites/tenant/${tenantId}`);
        setFavoriteProperties(response.data.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProperties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;