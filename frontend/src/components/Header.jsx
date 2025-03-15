import React from 'react';
import { Bell, UserCircle, MessageSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <h2 className="text-xl font-semibold text-[#103538]">Welcome back, Alex!</h2>
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
              <p className="text-sm font-medium text-[#103538]">Alex Johnson</p>
              <p className="text-xs text-[#759B87]">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
