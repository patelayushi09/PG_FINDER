import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, Users, Wifi, Coffee, Heart } from 'lucide-react';

export function PropertyCard({ image, title, location, price, rating, amenities, type }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:text-[#D96851]">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-[#103538]">{title}</h3>
          <div className="flex items-center bg-[#DCD29F] bg-opacity-20 px-2 py-1 rounded">
            <span className="text-[#D8B258] text-sm">★ {rating}</span>
          </div>
        </div>
        <div className="flex items-center text-[#759B87] mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          {amenities.includes('wifi') && (
            <div className="p-1.5 bg-gray-100 rounded">
              <Wifi className="w-4 h-4 text-[#759B87]" />
            </div>
          )}
          {amenities.includes('meals') && (
            <div className="p-1.5 bg-gray-100 rounded">
              <Coffee className="w-4 h-4 text-[#759B87]" />
            </div>
          )}
          {type && (
            <div className="p-1.5 bg-gray-100 rounded">
              <Users className="w-4 h-4 text-[#759B87]" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#D96851]">{price}</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <button className="px-4 py-2 bg-[#103538] text-white rounded-lg hover:bg-opacity-90">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

PropertyCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  amenities: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
};

export default PropertyCard;

