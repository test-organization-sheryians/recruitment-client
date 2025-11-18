import React from "react";
import { Bell } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full md:w-[80%] flex flex-wrap items-center justify-between bg-white px-4 py-3 shadow-sm rounded-md">
      {/* Title */}
      <h2 className="text-base md:text-lg font-semibold text-gray-800">
        Dashboard Overview
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {/* Notification */}
        <div className="relative">
          <Bell className="w-6 h-6 text-blue-600 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="w-8 h-8 rounded-full border"
          />
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-800">Dev Nayak</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
