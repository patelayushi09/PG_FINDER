import React from 'react';

const Booking = () => {
  const bookings = [
    {
      id: 1,
      tenant: 'Amit Shah',
      property: 'Sunshine PG',
      checkIn: '2024-03-15',
      duration: '6 months',
      status: 'Confirmed',
    },
    {
      id: 2,
      tenant: 'Maya Patel',
      property: 'Green Valley PG',
      checkIn: '2024-03-20',
      duration: '12 months',
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-xl font-bold text-[#103538] mb-6">Booking Requests</h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`p-4 rounded-lg border shadow-sm text-[#103538] ${
              booking.status === 'Confirmed'
                ? 'bg-[#f9f9f6]' // Very light greenish-white for confirmed
                : 'bg-[#fdf8f0]' // Very light yellowish-white for pending
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{booking.tenant}</h4>
                <p className="text-sm">{booking.property}</p>
                <div className="mt-2">
                  <p className="text-sm">Check-in: {booking.checkIn}</p>
                  <p className="text-sm">Duration: {booking.duration}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'Confirmed'
                    ? 'bg-green-200 text-green-800' // Softer green status
                    : 'bg-yellow-200 text-yellow-800' // Softer yellow status
                }`}
              >
                {booking.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;
