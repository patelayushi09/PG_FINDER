// import React from 'react';
// import { Building2, Users, Wallet, TrendingUp } from 'lucide-react';
// import StatsCard from '../components/StatsCard';
// import ActivityList from '../components/ActivityList';
// import PerformanceMetrics from '../components/PerformanceMetrices';

// const recentActivities = [
//   {
//     type: 'New Property',
//     user: 'John Doe',
//     time: '2 hours ago',
//     status: 'Pending Verification'
//   },
//   {
//     type: 'Booking',
//     user: 'Sarah Smith',
//     time: '5 hours ago',
//     status: 'Confirmed'
//   },
//   {
//     type: 'Property Update',
//     user: 'Mike Johnson',
//     time: '1 day ago',
//     status: 'Completed'
//   }
// ];

// function Dashboard() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2 space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//           <StatsCard title="Total Properties" value="156" trend="+12%" Icon={Building2} />
//           <StatsCard title="Active Tenants" value="89" trend="+8%" Icon={Users} />
//           <StatsCard title="Monthly Revenue" value="₹2.4L" trend="+15%" Icon={Wallet} />
//           <StatsCard title="Occupancy Rate" value="92%" trend="+5%" Icon={TrendingUp} />
//         </div>
//         <ActivityList activities={recentActivities} />
//       </div>
//       <div className="lg:col-span-1">
//         <PerformanceMetrics />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { Building2, Users, Wallet, TrendingUp } from 'lucide-react';
import axios from 'axios';
import StatsCard from '../../components/StatsCard';
import ActivityList from '../../components/ActivityList';
import PerformanceMetrics from '../../components/PerformanceMetrics';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0,
      activeBookings: 0,
      upcomingBookings: 0,
      favoritesCount: 0,
    },
    recentActivities: [],
    performanceMetrics: {
      responseRate: 0,
      bookingCompletionRate: 0,
      favoriteUtilizationRate: 0,
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // TODO: Replace with actual tenant ID from auth context
        const tenantId = "dummy-tenant-id";
        const response = await axios.get(`http://localhost:5000/tenant/dashboard/${tenantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if(response.data.error){
          navigate("/tenant/login")
        }
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatsCard 
            title="Total Properties" 
            value={dashboardData.stats.totalBookings.toString()} 
            trend="+12%" 
            Icon={Building2} 
          />
          <StatsCard 
            title="Active Tenants" 
            value={dashboardData.stats.activeBookings.toString()} 
            trend="+8%" 
            Icon={Users} 
          />
          <StatsCard 
            title="Monthly Revenue" 
            value="₹2.4L" 
            trend="+15%" 
            Icon={Wallet} 
          />
          <StatsCard 
            title="Occupancy Rate" 
            value="92%" 
            trend="+5%" 
            Icon={TrendingUp} 
          />
        </div>
        <ActivityList activities={dashboardData.recentActivities} />
      </div>
      <div className="lg:col-span-1">
        <PerformanceMetrics />
      </div>
    </div>
  );
}

export default Dashboard;