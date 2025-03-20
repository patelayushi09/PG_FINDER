import { Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-[#E6F0ED]   px-6 py-4 shadow-md w-full">
      {/* Left Section - Title */}
      <div className="ml-64"> {/* Push the header right to avoid overlap */}
        <h1 className="text-2xl font-bold text-[#103538]">Admin Dashboard</h1>
        <p className="text-[#759B87]">Welcome back, Admin</p>
      </div>

      {/* Right Section - Search & Notifications */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#D8B258]"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative">
          <Bell className="w-6 h-6 text-[#103538]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D96851] rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
