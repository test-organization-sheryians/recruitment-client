import React from "react";
import KpiCard from "./KpiCard";

const KPIS = [
  {
    title: "Shortlisted",
    count: 42,
    change: "-8%",
    changeTone: "down" as const,
  },
  { title: "Current Vacancies", count: 104, change: "+5%", changeTone: "up" as const },
];

export default function KpisRow() {
  return (
    <div className="grid grid-cols-12 gap-4 mb-6">
      {/* Left: KPI block aligned with VacanciesSection (lg:col-span-7) */}
      <div className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <KpiCard {...KPIS[0]} />
          </div>

          <div className="w-full">
            <KpiCard {...KPIS[1]} />
          </div>
        </div>
      </div>

      {/* Right: spacer so KPI block aligns with vacancies below */}
      <div className="col-span-12 lg:col-span-5" />
    </div>
  );
}