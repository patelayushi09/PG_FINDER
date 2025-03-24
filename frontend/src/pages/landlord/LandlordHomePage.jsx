



import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, DollarSign, Building2 } from "lucide-react";

function LandlordHomePage() {
  const stats = [
    { title: "Total PGs", value: "12", trend: "+5.6%", icon: Building2 },
    { title: "Active Listings", value: "8", trend: "+3.2%", icon: Home },
    { title: "Total Tenants", value: "24", trend: "+7.8%", icon: Users },
    { title: "Monthly Revenue", value: "₹86,000", trend: "+10.5%", icon: DollarSign },
  ];

  const allProperties = [
    { 
      id: 1, 
      name: "Sunshine PG", 
      location: "Koramangala", 
      occupancy: "85%", 
      status: "Available", 
      revenue: "₹45,000", 
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3" 
    },
    { 
      id: 2, 
      name: "Green Valley PG", 
      location: "HSR Layout", 
      occupancy: "92%", 
      status: "Available", 
      revenue: "₹41,000", 
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3" 
    },
    { 
      id: 3, 
      name: "Lakeview PG", 
      location: "Indiranagar", 
      occupancy: "100%", 
      status: "Rented ", 
      revenue: "₹50,000", 
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3"
    },
  ];
  

  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProperties = statusFilter === "All"
    ? allProperties
    : allProperties.filter((property) => property.status === statusFilter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-row min-h-screen w-full bg-cream/10"
    >
      {/* Sidebar Placeholder (Ensure sidebar is handled properly) */}
      <div className="w-64"></div> 

      {/* Main Content (Takes up full width) */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#103538] mb-6">Dashboard Overview</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#DCD29F]/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-[#D8B258]" />
                </div>
                <span className={`text-sm font-medium ${stat.trend.startsWith("+") ? "text-green-500" : "text-[#D96851]"}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-[#759B87] text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#103538]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#103538]">Your Properties</h2>
            <select
              className="border border-gray-200 p-2 rounded-lg text-[#103538] focus:outline-none focus:ring-2 focus:ring-[#D96851] bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Properties</option>
              <option value="Available">Available</option>
              <option value="Rented "> Rented</option>
            </select>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#103538] text-lg mb-1">{property.name}</h4>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Occupancy</p>
                      <p className="font-semibold text-[#D96851]">{property.occupancy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold text-[#D8B258]">{property.revenue}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      property.status === "Available" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LandlordHomePage;
