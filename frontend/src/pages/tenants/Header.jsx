import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, MessageSquare } from 'lucide-react';

export function Header(tenantName) {
  const [storedTenantName, setStoredTenantName] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem("tenantName");

    try {
      if (savedName) {
        setStoredTenantName(JSON.parse(savedName));
      }
    } catch (error) {
      console.error("Error parsing tenantName from localStorage:", error);
      localStorage.removeItem("tenantName"); // Remove invalid data
      setStoredTenantName(null);
    }
  }, []);

  return (
    <header className="bg-[#E6F0ED] shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Show Logged-in User Name */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {storedTenantName ? `${storedTenantName.firstName} ${storedTenantName.lastName}` : "Guest"}!
        </h2>
        <div className="flex items-center space-x-6">
          <button className="relative">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D96851] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </span>
          </button>
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D96851] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">2</span>
            </span>
          </button>
          <div className="flex items-center space-x-3 border-l pl-6">
            <UserCircle className="w-10 h-10 text-[#759B87]" />
            <div>
              {/* Show Tenant Name */}
              <p className="text-sm font-bold text-[#1c5b37]">
                {storedTenantName ? `${storedTenantName.firstName} ${storedTenantName.lastName}` : "Guest"}
              </p>
              

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
