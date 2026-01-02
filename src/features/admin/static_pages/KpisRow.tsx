"use client";

import KpiCard from "./KpiCard";
import { useQuery } from "@tanstack/react-query";
import { getShortlistedCount } from "@/api";
import { useGetJobs } from "../jobs/hooks/useJobApi";

export default function KpisRow() {
  const { data: shortlistedData } = useQuery({
    queryKey: ["shortlistedCount"],
    queryFn: getShortlistedCount,
    staleTime: 1000 * 60,
  });

  const { data: jobs } = useGetJobs();

  const currentVacancies = Array.isArray(jobs) ? jobs.length : 0;

  const KPIS = [
    {
      title: "Shortlisted",
      count: shortlistedData?.shortlistedApplications ?? 0,
      change: "-8%",
      changeTone: "down" as const,
    },
    {
      title: "Current Vacancies",
      count: currentVacancies,
      change: "+5%",
      changeTone: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 mb-4">
      {KPIS.map((k) => (
        <div key={k.title} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <KpiCard {...k} />
        </div>
      ))}
    </div>
  );
}
