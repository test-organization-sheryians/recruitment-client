
import React from "react";

interface StatusCardProps {
  title: string;
  iconSrc: string;
  count: number | string;
  change?: string;
  changeIconSrc?: string;
  changeBgColor?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  iconSrc,
  count,
  change,
  changeIconSrc,
  changeBgColor = "#DBFFDB",
}) => {
  return (
    <div className="bg-[#E4E5E6] font-[gilroy] w-full h-full">
      <div className="group bg-white hover:border-2 hover:cursor-pointer transition-all ease-linear duration-75 border-[#719BDB] w-full h-full px-3 sm:px-4 py-3 sm:py-4 rounded-2xl flex flex-col">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Icon changes color on hover */}
          <img
            src={iconSrc}
            alt="icon"
            className="transition-all duration-75 group-hover:text-[#4F65F1] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          />
          <h3 className="font-medium text-[#8A8A8A] transition-all duration-75 group-hover:text-[#4F65F1] text-xs sm:text-sm md:text-base truncate">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-3 sm:mt-4 md:mt-5 gap-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold truncate">{count}</h2>
          {change && changeIconSrc && (
            <div
              className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 gap-0.5 sm:gap-1 text-xs sm:text-sm rounded-xl sm:rounded-2xl whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: changeBgColor }}
            >
              <span className="font-medium">{change}</span>
              <img src={changeIconSrc} alt="change icon" className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard