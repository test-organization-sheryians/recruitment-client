import React from "react";
import KpiCard from "./KpiCard";

const KPIS = [
  {
    title: "Total Resumes",
    count: 156,
    change: "+12%",
    changeTone: "up" as const,
  },
  {
    title: "Shortlisted",
    count: 42,
    change: "-8%",
    changeTone: "down" as const,
  },
  { title: "Current Vacancies", count: 104, change: "+5%", changeTone: "up" as const },
  { title: "Batches", count: 1124, change: "-2%", changeTone: "down" as const },
];

export default function KpisRow() {
  return (
    <div className='grid grid-cols-12 gap-4 mb-4'>
      {KPIS.map((k) => (
        <div key={k.title} className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <KpiCard {...k} />
        </div>
      ))}
    </div>
  );
}