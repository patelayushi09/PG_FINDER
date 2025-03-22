
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Star, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminHomePage() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    activeUsers: 0,
    listedPGs: 0,
    avgRating: 0,
    recentBookings: [],
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // const adminId = localStorage.getItem('adminId');

        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.error) {
          navigate('/admin/login');
        }
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const stats = [
    { title: 'Total Bookings', value: dashboardData.totalBookings, trend: '+12.5%', icon: Calendar },
    { title: 'Active Users', value: dashboardData.activeUsers, trend: '+8.2%', icon: Users },
    { title: 'Listed PGs', value: dashboardData.listedPGs, trend: '+15.3%', icon: Building },
    { title: 'Avg Rating', value: dashboardData.avgRating, trend: '+2.4%', icon: Star },
  ];

  const filteredBookings = statusFilter === 'All' ? dashboardData.recentBookings : dashboardData.recentBookings.filter((booking) => booking.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h1 className="text-2xl font-bold text-deepTeal mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cream/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-coral'}`}>{stat.trend}</span>
            </div>
            <h3 className="text-sage mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-deepTeal">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-deepTeal">Recent Bookings</h2>
          <select className="border p-2 rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="border-b border-sage/10">
              <th className="text-left py-3 px-4">Booking ID</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">PG Name</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{booking.id}</td>
                <td className="py-3 px-4">{booking.user}</td>
                <td className="py-3 px-4">{booking.pg}</td>
                <td className="py-3 px-4">{booking.date}</td>
                <td className="py-3 px-4">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AdminHomePage;
