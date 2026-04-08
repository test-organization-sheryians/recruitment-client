"use client";

import KpiCard from "./KpiCard";
import { useQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { getShortlistedCount } from "@/api";
import { useEffect, useState } from "react";

/* ===================== TYPES ===================== */

type Job = {
  _id: string;
  // add other job fields if needed
};

type Pagination = {
  totalRecords?: number;
};

type JobsPage = {
  data: Job[];
  pagination?: Pagination;
};

type JobsInfiniteData = InfiniteData<JobsPage>;

/* ===================== COMPONENT ===================== */

export default function KpisRow() {
  const queryClient = useQueryClient();

  /* Shortlisted KPI */
  const { data: shortlistedData } = useQuery({
    queryKey: ["shortlistedCount"],
    queryFn: getShortlistedCount,
    staleTime: 1000 * 60,
  });

  /* Read infinite jobs cache */
  const getJobsInfiniteData = (): JobsInfiniteData | undefined => {
    const queries = queryClient.getQueriesData<JobsInfiniteData>({
      queryKey: ["admin-jobs"],
    });
    return queries[0]?.[1] ?? queryClient.getQueryData<JobsInfiniteData>(["admin-jobs"]);
  };

  const computeTotalFromCache = (data?: JobsInfiniteData): number => {
    const backendTotal = data?.pages?.[0]?.pagination?.totalRecords;
    if (typeof backendTotal === "number" && backendTotal > 0) {
      return backendTotal;
    }

    // fallback: count loaded items
    return (
      data?.pages.reduce((sum, page) => sum + page.data.length, 0) ?? 0
    );
  };

  const [totalVacancies, setTotalVacancies] = useState<number>(() =>
    computeTotalFromCache(getJobsInfiniteData())
  );

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setTotalVacancies(computeTotalFromCache(getJobsInfiniteData()));
    });
    return unsubscribe;
  }, [queryClient]);

  const KPIS = [
    {
      title: "Shortlisted",
      count: shortlistedData?.shortlistedApplications ?? 0,
      changeTone: "down" as const,
    },
    {
      title: "Current Vacancies",
      count: totalVacancies,
      changeTone: "up" as const,
      isLive: true,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 mb-4">
      {KPIS.map((k) => (
        <div
          key={k.title}
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        >
          <KpiCard {...k} />
        </div>
      ))}
    </div>
  );
}
