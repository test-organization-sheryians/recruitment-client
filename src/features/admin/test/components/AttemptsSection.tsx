"use client";

import React, { useMemo, useState } from "react";
import { useGetUserAttempts } from "@/features/admin/test/hooks/useTest";

type Props = {
  testId: string;
};

type Attempt = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  score: number;
  isPassed: boolean;
  status: "Graded" | "Failed" | "Started";
};

export default function AttemptsSection({ testId }: Props) {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetUserAttempts(testId);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "passed" | "failed"
  >("all");

  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const processedAttempts = useMemo(() => {
    const attempts: Attempt[] = Array.isArray(response)
      ? response
      : response?.data || [];

    let filtered = [...attempts];

    if (filterStatus === "passed") {
      filtered = filtered.filter(
        (a) => a.isPassed === true && a.status === "Graded"
      );
    }

    if (filterStatus === "failed") {
      filtered = filtered.filter(
        (a) => a.isPassed === false && a.status === "Failed"
      );
    }

    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );

    return filtered;
  }, [response, sortOrder, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-gray-500">Loading attempts...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
        Failed to load attempts.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* CONTROLS */}
      <div className="flex items-center justify-between relative z-30">
        {/* SORT */}
        <div className="relative">
          <button
            onClick={() => setOpenSort((p) => !p)}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            Sort
            <span className="text-xs text-gray-400">
              {sortOrder === "desc" ? "High → Low" : "Low → High"}
            </span>
          </button>

          {openSort && (
            <div className="absolute left-0 mt-2 w-44 rounded-xl border bg-white shadow-xl overflow-hidden">
              {["desc", "asc"].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setSortOrder(v as "asc" | "desc");
                    setOpenSort(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    sortOrder === v ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {v === "desc" ? "High to Low" : "Low to High"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FILTER */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter((p) => !p)}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            Filter
            <span className="text-xs text-gray-400 capitalize">
              {filterStatus}
            </span>
          </button>

          {openFilter && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-xl overflow-hidden">
              {["all", "passed", "failed"].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setFilterStatus(v as "all" | "passed" | "failed");
                    setOpenFilter(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize ${
                    filterStatus === v ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      {processedAttempts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-400 font-medium">No attempts found</p>
          <p className="text-gray-400 text-xs mt-1">
            Try changing filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedAttempts.map((a) => {
            const statusStyles =
              a.status === "Graded" && a.isPassed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : a.status === "Failed"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"; // Started

            const dotStyles =
              a.status === "Graded" && a.isPassed
                ? "bg-emerald-500"
                : a.status === "Failed"
                ? "bg-red-500"
                : "bg-yellow-500";

            return (
              <div
                key={a._id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm"
              >
                {/* USER INFO */}
                <div>
                  <p className="font-semibold text-gray-900">
                    {a.firstName} {a.lastName}
                  </p>

                  <p className="text-xs text-gray-400">{a.email}</p>

                  <p className="text-[10px] text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>


                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">
                      Score
                    </p>
                    <p className="text-lg font-bold">{a.score}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dotStyles}`}
                    />
                    {a.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
