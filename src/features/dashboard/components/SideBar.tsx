"use client";
import React, { useState } from "react";
import {
  MdDashboard,
  MdWork,
  MdBookmark,
  MdEvent,
  MdPeople,
  MdMenu,
  MdClose,
} from "react-icons/md";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: <MdDashboard className="text-xl" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <MdWork className="text-xl" />, label: "Jobs", path: "/jobs" },
    {
      icon: <MdBookmark className="text-xl" />,
      label: "Shortlist",
      path: "/shortlist",
    },
    {
      icon: <MdEvent className="text-xl" />,
      label: "Interview",
      path: "/interview",
    },
    {
      icon: <MdPeople className="text-xl" />,
      label: "Client",
      path: "/client",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? (
          <MdClose className="text-2xl" />
        ) : (
          <MdMenu className="text-2xl" />
        )}
      </button>/

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-opacity-30 backdrop-blur-sm z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-[5px_0_25px_rgba(0,0,0,0.15)] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-6 border-b border-indigo-700 shadow-sm">
            <h1 className="text-2xl font-bold tracking-wide mt-10 lg:mt-0 text-indigo-700">
              Require
            </h1>
            <p className="text-indigo-400 text-sm mt-1">Recruitment Portal</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-indigo-100 transition-all duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200 text-indigo-700">
                  {item.icon}
                </span>
                <span className="font-medium text-gray-800">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
