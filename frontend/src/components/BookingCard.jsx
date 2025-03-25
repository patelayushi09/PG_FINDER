import React from "react";
import { Calendar, MapPin, Phone } from "lucide-react";

export function BookingCard({ propertyImage, propertyName, location, checkIn, checkOut, status, landlordName, landlordPhone }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex space-x-4">
        <img src={propertyImage} alt={propertyName} className="w-24 h-24 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{propertyName}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{checkIn} - {checkOut}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between">
          <span className="text-sm">Landlord: {landlordName}</span>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg" onClick={() => window.location.href = `tel:${landlordPhone}`}>
            <Phone className="w-4 h-4 mr-1" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;
