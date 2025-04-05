import React, { useState, useEffect } from "react";
import ChatNotification from "../../components/ChatNotification";
import { UserCircle } from "lucide-react";

export const LandlordHeader = () => {
  const [landlordName, setLandlordName] = useState("Guest");

  useEffect(() => {
    const landlordId = localStorage.getItem("landlordId");
    if (landlordId) {
      try {
        const savedLandlordName = localStorage.getItem("landlordName");
        if (savedLandlordName) {
          setLandlordName(JSON.parse(savedLandlordName)); // Ensure proper parsing
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  return (
    <header className="bg-[#E6F0ED] shadow-sm fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logged-in User Welcome Text */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {landlordName}!
        </h2>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-6">
          {/* Chat Notification First */}
          <div className="relative">
            <ChatNotification />
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 border-l pl-4">
            <UserCircle className="w-10 h-10 text-[#759B87]" />
            <div>
              <p className="text-sm font-bold text-[#1c5b37]">{landlordName}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandlordHeader;
