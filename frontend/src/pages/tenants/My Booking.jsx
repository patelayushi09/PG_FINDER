

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from '../../components/BookingCard';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // TODO: Replace with actual tenant ID from auth context
        const tenantId = "dummy-tenant-id";
        const response = await axios.get(`http://localhost:5000/bookings/tenant/${tenantId}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <BookingCard key={index} {...booking} />
        ))}
      </div>
    </div>
  );
}

export default MyBookings;