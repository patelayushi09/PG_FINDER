
import { UserCircle } from "lucide-react";
import ChatNotification from "./ChatNotification";

export function Header() {
  const tenantId = localStorage.getItem("tenantId");

  let userData = { firstName: "Guest", lastName: "" };

  if (tenantId) {
    try {
      const savedTenantName = localStorage.getItem("tenantName");
      if (savedTenantName) {
        userData = JSON.parse(savedTenantName);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  return (
    <header className="bg-[#E6F0ED] shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Welcome Message */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {userData ? `${userData.firstName} ${userData.lastName}` : "Guest"}!
        </h2>

        {/* User Section */}
        <div className="flex items-center space-x-4 border-l pl-6">
          {/* Chat Notification First */}
          <div className="relative">
            <ChatNotification />
          </div>

          {/* User Profile Icon */}
          <UserCircle className="w-8 h-8 text-[#759B87]" />

          {/* User Name */}
          <p className="text-sm font-bold text-[#1c5b37]">
            {userData ? `${userData.firstName} ${userData.lastName}` : "Guest"}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
