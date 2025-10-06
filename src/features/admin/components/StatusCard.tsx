import React from "react";

interface StatusCardProps {
  title: string;
  iconSrc: string;
  count: number | string;
  change?: string;
  changeIconSrc?: string;
  changeBgColor?: string;
  cardWidth?: string; // Optional to customize width
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  iconSrc,
  count,
  change,
  changeIconSrc,
  changeBgColor = "#DBFFDB",
  cardWidth = "w-[185px]",
}) => {
  return (
    <div className=" bg-[#E4E5E6] font-[gilroy]">
      <div
        className={`group bg-white hover:border-2 hover:cursor-pointer transition-all ease-linear duration-75 border-[#719BDB] ${cardWidth} pr-4 pt-4 pl-2.5 pb-3 rounded-2xl`}
      >
        <div className="flex items-center gap-2">
          {/* Icon changes color on hover */}
          <img
            src={iconSrc}
            alt="icon"
            className="transition-all duration-75 group-hover:text-[#4F65F1]"
          />
          <h3 className="font-medium text-[#8A8A8A] transition-all duration-75 group-hover:text-[#4F65F1]">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-5">
          <h2 className="text-3xl">{count}</h2>
          {change && changeIconSrc && (
            <div
              className={`flex items-center px-2 py-1 pr-2.5 gap-1 text-sm w-fit rounded-2xl`}
              style={{ backgroundColor: changeBgColor }}
            >
              <h1>{change}</h1>
              <img src={changeIconSrc} alt="change icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
