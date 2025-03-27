import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Check, X, MapPin, User, Mail, Phone } from "lucide-react";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null); // Track selected tenant

  const landlordId = localStorage.getItem("landlordId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:5000/landlord/bookings/${landlordId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [landlordId]);

  // Place handleStatusUpdate here
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      console.log("Updating booking ID:", bookingId, "to status:", status); //  Debug log
  
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://localhost:5000/landlord/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response:", response.data);
  
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error.response?.data || error.message);
    }
  };
  
  // Function to handle tenant details modal
  const showTenantDetails = (tenant) => {
    setSelectedTenant(tenant);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedTenant(null);
  };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-2xl font-bold text-[#103538]">Booking Requests</h3>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 rounded-lg shadow-sm border flex justify-between items-center"
              style={{ backgroundColor: "#FFFCF6", borderColor: "#EEE7DB", borderWidth: "1px" }}
            >
              {/* Left Section: Property Details */}
              <div className="flex items-center space-x-6">
                {/* Clickable Property Image */}
                <div
                  className="w-28 h-28 overflow-hidden rounded-lg border border-gray-200 cursor-pointer"
                  onClick={() => showTenantDetails(booking.tenantId)}
                >
                  <img
                    src={booking.propertyId.image || "https://via.placeholder.com/150"}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {booking.propertyId.propertyName}
                  </h4>

                  {/* Location */}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1 text-green-600" />
                    <span>
                      {booking.propertyId.cityId?.name}, {booking.propertyId.stateId?.name}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                    <span>
                      {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    <span>₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Status & Actions */}
              <div className="flex flex-col items-end space-y-3">
                {/* Status Indicator */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800`}>
                  {booking.status}
                </div>

                {/* Accept/Reject Buttons */}
                {booking.status === "pending" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, "rejected")}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No booking requests found.</p>
          </div>
        )}
      </div>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-900">Tenant Details</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {selectedTenant.firstName} {selectedTenant.lastName}
                </span>

              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">{selectedTenant.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">{selectedTenant.phoneno}</span>
              </div>
            </div>
            <button
              className="mt-6 w-full py-2 bg-[#D96851] text-white rounded-lg hover:bg-[#ec8e7b] transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
