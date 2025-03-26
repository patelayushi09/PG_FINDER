import React from "react";
import { Calendar, MapPin, Phone } from "lucide-react";

export function BookingCard(props) {
 
  const propertyImage = props.propertyId.image;
  const propertyName = props.propertyId.propertyName;
  const city = props.propertyId?.cityId?.name;
  const checkIn = new Date(props.checkInDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const checkOut = new Date(props.checkOutDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const status = props.status;
  const landlordName = props.landlordId.name;
  const landlordPhone = props.landlordId.phoneno;

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
        case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-[#FDFCF4] rounded-xl p-5 shadow-md border border-gray-200 relative">
      <div className="flex space-x-5">
        <img
          src={propertyImage}
          alt={propertyName}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{propertyName}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 text-green-600" />
            <span>{city}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
            <span>{checkIn} - {checkOut}</span>
          </div>
        </div>
      </div>

      {/* Status Badge (Right Side) */}
      <div className={`absolute top-5 right-5 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
        {status}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Landlord: <span className="font-medium text-gray-900">{landlordName}</span>
        </span>
        <button
          className="flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all"
          onClick={() => window.location.href = `tel:${landlordPhone}`}
        >
          <Phone className="w-4 h-4 mr-1" />
          {landlordPhone}
        </button>
      </div>
    </div>
  );
}

export default BookingCard;

