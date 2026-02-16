"use client";

import { useMemo, useState } from "react";
import {
  useGetAllReports,
  useUpdateReportStatus,
  useDeleteReport,
} from "@/features/admin/jobReports/hooks/useJobReportApi";

import { useToast } from "@/components/ui/Toast";

/* ---------------- Dummy Generator ---------------- */

const generateDummyReports = () => {
  return Array.from({ length: 25 }).map((_, i) => ({
    _id: `dummy-${i}`,
    jobId: `job-${1000 + i}`,
    userId: `user-${2000 + i}`,
    reason: ["spam", "fake", "wrong_info", "other"][i % 4] as
      | "spam"
      | "fake"
      | "wrong_info"
      | "other",
    description: `This is dummy report ${i + 1}`,
    status: ["pending", "reviewed", "resolved"][i % 3] as
      | "pending"
      | "reviewed"
      | "resolved",
    createdAt: new Date(Date.now() - i * 10000000).toISOString(),
  }));
};

export default function ReportsTable() {
  const toast = useToast();

  const { data: apiReports } = useGetAllReports();
  const updateStatusMutation = useUpdateReportStatus();
  const deleteMutation = useDeleteReport();

  /* ------------ Use Dummy If Needed ------------ */

  const reports = apiReports?.length ? apiReports : generateDummyReports();

  /* ------------ UI State ------------ */

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "reviewed" | "resolved"
  >("all");

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ------------ Filtering + Sorting ------------ */

  const filteredReports = useMemo(() => {
    let filtered =
      statusFilter === "all"
        ? reports
        : reports.filter((r) => r.status === statusFilter);

    filtered = filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return filtered;
  }, [reports, statusFilter, sortOrder]);

  /* ------------ Pagination ------------ */

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ------------ Handlers ------------ */

  const handleStatusChange = (
    id: string,
    status: "pending" | "reviewed" | "resolved",
  ) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update"),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Report deleted"),
      onError: () => toast.error("Delete failed"),
    });
  };

  /* ------------ UI ------------ */

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Job Reports</h1>

      {/* Filters */}
      <div className="mb-4 flex gap-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as "all" | "pending" | "reviewed" | "resolved",
            )
          }
          className="rounded border p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="rounded border p-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Job</th>
              <th className="p-3">User</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReports.map((report) => (
              <tr key={report._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-xs">{report.jobId}</td>
                <td className="p-3 text-xs">{report.userId}</td>
                <td className="p-3 capitalize">
                  {report.reason.replace("_", " ")}
                </td>
                <td className="p-3">
                  <select
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(
                        report._id,
                        e.target.value as "pending" | "reviewed" | "resolved",
                      )
                    }
                    className="rounded border p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
