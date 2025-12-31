"use client";
import KpiCard from "./KpiCard";
import { useQuery } from "@tanstack/react-query";
import { getShortlistedCount } from "@/api";

export default function KpisRow() {
  const { data } = useQuery({
    queryKey: ["shortlistedCount"],
    queryFn: getShortlistedCount,
    staleTime: 1000 * 60,
  });

  const KPIS = [
    {
      title: "Total Resumes",
      count: 156,
      change: "+12%",
      changeTone: "up" as const,
    },
    {
      title: "Shortlisted",
      count: data?.shortlistedApplications ?? 0,
      change: "-8%",
      changeTone: "down" as const,
    },
    { title: "Current Vacancies", count: 104, change: "+5%", changeTone: "up" as const },
    { title: "Batches", count: 1124, change: "-2%", changeTone: "down" as const },
  ];

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