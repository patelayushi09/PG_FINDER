import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, Heart, Star } from 'lucide-react';

// Function to get background color based on furnishing status
const getFurnishingStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'furnished':
      return 'bg-[#759B87] text-white'; 
    case 'semi-furnished':
      return 'bg-[#D8B258] text-white'; 
    case 'unfurnished':
      return 'bg-[#D96851] text-white'; 
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

// Function to render rating stars
const renderStars = (rating) => {
  const stars = [];
  const filledStars = Math.round(rating); // Round rating to nearest integer

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-4 h-4 ${i <= filledStars ? 'text-[#D8B258] fill-[#D8B258]' : 'text-gray-300'}`} 
      />
    );
  }
  return stars;
};

export function PropertyCard({ image, propertyName, cityId, stateId, basePrice, rating, furnishingStatus }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative">
        <img 
          src={image || '/default-image.jpg'} 
          alt={propertyName || 'Property'} 
          className="w-full h-48 object-cover" 
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:text-[#D96851]">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Property Name */}
        <h3 className="text-lg font-semibold text-[#103538]">
          {propertyName || 'Unnamed Property'}
        </h3>

        {/* City & State */}
        <div className="flex items-center text-[#759B87] mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{cityId?.name || 'Unknown City'}, {stateId?.name || 'Unknown State'}</span>
        </div>

        {/* Price, Rating & Furnishing Status */}
        <div className="flex justify-between items-center">
          {/* Price */}
          <div>
            <span className="text-2xl font-bold text-[#D96851]">
              {basePrice ? `₹${basePrice}` : 'N/A'}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>

          {/* Rounded Furnishing Status */}
          <div className={`px-4 py-1 rounded-full text-sm font-medium ${getFurnishingStyles(furnishingStatus)}`}>
            {furnishingStatus || 'Not Specified'}
          </div>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center mt-2">
            {renderStars(rating)}
            <span className="text-sm text-gray-600 ml-2">({rating})</span>
          </div>
        )}
      </div>
    </div>
  );
}

PropertyCard.propTypes = {
  image: PropTypes.string,
  propertyName: PropTypes.string,
  cityId: PropTypes.object,  
  stateId: PropTypes.object, 
  basePrice: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  furnishingStatus: PropTypes.string,
};

export default PropertyCard;
