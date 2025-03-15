// import React from 'react';
// import BookingCard from '../components/BookingCard';

// const bookings = [
//   {
//     propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     propertyName: "Sunshine PG Deluxe",
//     location: "Koramangala, Bangalore",
//     checkIn: "01 Mar 2024",
//     checkOut: "01 Mar 2025",
//     status: "Active",
//     landlordName: "Mrs. Sharma",
//     landlordPhone: "+91 98765 43210"
//   },
//   {
//     propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     propertyName: "Green View Residency",
//     location: "HSR Layout, Bangalore",
//     checkIn: "15 Mar 2024",
//     checkOut: "15 Mar 2025",
//     status: "Upcoming",
//     landlordName: "Mr. Reddy",
//     landlordPhone: "+91 98765 43211"
//   }
// ];

// function MyBookings() {
//   return (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         {bookings.map((booking, index) => (
//           <BookingCard key={index} {...booking} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MyBookings;

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