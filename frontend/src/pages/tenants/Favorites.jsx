import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';

function Favorites() {
  const [favoriteProperties, setFavoriteProperties] = useState([]);

  const fetchFavorites = async () => {
    try {
      const tenantId = localStorage.getItem("tenantId");

      if (!tenantId) {
        console.error("Tenant ID not found");
        return;
      }

      const response = await axios.get(`http://localhost:5000/tenant/favorites/${tenantId}`);
      const properties = response.data.data || [];

      const formattedProperties = properties.map((property) => ({
        ...property,
        cityId: { name: property.location?.city || "Unknown City" },  
        stateId: { name: property.location?.state || "Unknown State" }, 
        isFavorited: true,
      }));
      
    

      setFavoriteProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <h2 className="text-2xl font-semibold text-[#103538]">Your Favorite Properties</h2>

      {favoriteProperties.length === 0 ? (
        <p className="text-gray-600">No favorite properties yet. Start adding some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard
            key={property._id || property.id}
            {...property}
            cityId={{ name: property.city }} // Ensure this follows the expected structure
            stateId={{ name: property.state }}
            onFavorite={fetchFavorites}
          />
          
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;