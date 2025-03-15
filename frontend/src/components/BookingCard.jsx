import React from 'react';
import { Calendar, MapPin, Phone } from 'lucide-react';

export function BookingCard({
  propertyImage,
  propertyName,
  location,
  checkIn,
  checkOut,
  status,
  landlordName,
  landlordPhone
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex space-x-4">
        <img
          src={propertyImage}
          alt={propertyName}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-[#103538]">{propertyName}</h3>
            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center text-[#759B87] mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <div className="flex items-center text-[#D8B258]">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{checkIn} - {checkOut}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Landlord:</span>
            <span className="text-sm font-medium">{landlordName}</span>
          </div>
          <button className="flex items-center px-3 py-1.5 bg-[#103538] text-white rounded-lg hover:bg-opacity-90">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-sm">{landlordPhone}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;
