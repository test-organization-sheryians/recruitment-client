

import React from "react";
import { Bell, Search } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm rounded-md">
      <h2 className="text-lg font-semibold text-gray-800">Dashboard Overview</h2>

      <div className="flex items-center w-1/3 bg-gray-50 border border-blue-400 rounded-full px-3 py-1">
        <Search className="text-blue-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-blue-600 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="w-8 h-8 rounded-full border"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Dev Nayak</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;