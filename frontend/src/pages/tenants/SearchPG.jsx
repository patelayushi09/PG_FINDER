import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';
import PropertyFilter from '../admin/PropertyFilter';

function SearchPG() {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Filter states
  const [furnishingFilter, setFurnishingFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  

  const fetchFavorites = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      if (!tenantId) return;

      const response = await axios.get(`http://localhost:5000/tenant/favorites/${tenantId}`);
      const favorites = response.data.data || [];
      const favoriteIdSet = new Set(favorites.map(fav => fav._id || fav.id));
      setFavoriteIds(favoriteIdSet);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tenant/properties');
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  // Filter properties based on search term, availability, furnishing status, and favorites
  const filteredProperties = properties.filter(property => {
    const lowerSearch = searchTerm.toLowerCase();
    const propertyId = property._id || property.id;

    // Exclude favorited properties
    if (favoriteIds.has(propertyId)) {
      return false;
    }

    // Check search term (property name, city, state)
    const matchesSearch =
      property.propertyName?.toLowerCase().includes(lowerSearch) ||
      property.cityId?.name?.toLowerCase().includes(lowerSearch) ||
      property.stateId?.name?.toLowerCase().includes(lowerSearch);

    // Apply Filters
    return (
      matchesSearch &&
      (furnishingFilter ? property.furnishingStatus === furnishingFilter : true) &&
      (availabilityFilter ? property.availabilityStatus === availabilityFilter : true)
    );
  });

  const handleFavoriteUpdate = () => {
    fetchFavorites();
  };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by property name, city, or state..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Button & Dropdown */}
        <PropertyFilter
          onApplyFilter={(furnishing, availability) => {
            setFurnishingFilter(furnishing);
            setAvailabilityFilter(availability);
          }}
        />
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard 
              key={property._id || property.id}
              {...property}
              isFavorited={false}
              onFavorite={handleFavoriteUpdate}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No properties found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPG;