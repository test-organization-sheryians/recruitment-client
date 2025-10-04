"use client";
import React, { useState } from "react";

interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  department: string;
  isActive?: boolean;
}

interface ScheduleProps {
  events?: ScheduleEvent[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Schedule: React.FC<ScheduleProps> = ({
  events = [
    {
      id: "1",
      time: "1:00PM",
      title: "Marketing Strategy Presentation",
      department: "Marketing",
    },
    {
      id: "2",
      time: "2:30PM",
      title: "Client Slice have meet with dev",
      department: "Human Resource",
    },
    {
      id: "3",
      time: "4:00PM",
      title: "Candidate Communication",
      department: "Human Resource",
    },
    {
      id: "4",
      time: "5:30PM",
      title: "Candidate Communication",
      department: "Human Resource",
    },
  ],
  width,
  height,
  className = "",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const dateOptions = ["Today", "Tomorrow", "This Week", "Next Week", "This Month"];

  const getStyleValue = (value: string | number | undefined) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
  };

  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm ${className}`}
    >

      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Schedule</h2>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 rounded-lg text-blue-600 text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{selectedDate}</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedDate(option);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="space-y-0">
        {events.map((event, index) => {
          const isHovered = hoveredId === event.id;

          return (
            <div key={event.id} className="flex gap-2 sm:gap-4">

              <div className="w-14 sm:w-20 flex-shrink-0 pt-1">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{event.time}</span>
              </div>

              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 z-10 bg-blue-600"></div>
                {index < events.length - 1 && (
                  <div className="w-0.5 flex-1 bg-blue-400"></div>
                )}
              </div>

              <div className="flex-1 pb-3 sm:pb-4">
                <div
                  onMouseEnter={() => setHoveredId(event.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    border: isHovered ? '2px solid rgb(59, 130, 246)' : '2px solid transparent'
                  }}
                  className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                    isHovered
                      ? "bg-blue-50"
                      : "bg-gray-100"
                  }`}
                >
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">{event.department}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;

