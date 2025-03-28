import React, { useState, useEffect } from "react";
import { Bell, UserCircle, MessageSquare } from "lucide-react";

export const LandlordHeader = () => {
  const [storedLandlordName, setStoredLandlordName] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem("landlordName");

    try {
      if (savedName) {
        setStoredLandlordName(JSON.parse(savedName));
      }
    } catch (error) {
      console.error("Error parsing landlordName from localStorage:", error);
      localStorage.removeItem("landlordName"); // Remove invalid data
      setStoredLandlordName(null);
    }
  }, []);

  return (
    <header className="bg-[#E6F0ED] shadow-sm fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logged-in User Welcome Text */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {storedLandlordName ? storedLandlordName : "Landlord"}!
        </h2>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-6">
          {/* Messages Icon */}
          <button className="relative">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D96851] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </span>
          </button>

          {/* Notifications Icon */}
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D96851] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">2</span>
            </span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 border-l pl-4">
            <UserCircle className="w-10 h-10 text-[#759B87]" />
            <div>
              <p className="text-sm font-bold text-[#1c5b37]">
                {storedLandlordName ? storedLandlordName : "Landlord"}
              </p>


            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandlordHeader;
