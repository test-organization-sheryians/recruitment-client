"use client";

import { Plus, Pencil, MoreHorizontal, Loader2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useJobRoles } from "@/features/auth/hooks/useCreateJob";

export default function Jobget() {
  const router = useRouter();
  const { data, isLoading, error } = useJobRoles();

  // ✔ FIXED: API may return an array OR { data: [] }
  const jobs = Array.isArray(data) ? data : data?.data || [];

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full p-6 flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading jobs</h2>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || "Failed to load job data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs Management</h1>

        <button
          onClick={() => router.push("/admin/job/createjob")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add New Job</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Education</th>
              <th className="p-4 font-medium">Experience</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Skills</th>
              <th className="p-4 font-medium">Expiry</th>
              <th className="p-4 font-medium">Created By</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job?._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{job?.title || "N/A"}</td>
                  <td className="p-4">{job?.education || "N/A"}</td>

                  <td className="p-4">
                    {job?.requiredExperience || job?.experience || "N/A"}
                  </td>

                  <td
                    className="p-4 max-w-xs truncate"
                    title={job?.description}
                  >
                    {job?.description || "N/A"}
                  </td>

                  <td
                    className="p-4 max-w-xs truncate"
                    title={
                      Array.isArray(job?.skills)
                        ? job.skills.join(", ")
                        : job?.skills
                    }
                  >
                    {Array.isArray(job?.skills)
                      ? job.skills.join(", ")
                      : job?.skills || "N/A"}
                  </td>

                  <td className="p-4">
                    {job?.expiry
                      ? new Date(job.expiry).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4">{job?.createdBy || "Admin"}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Pencil
                        size={18}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() =>
                          router.push(`/admin/job/edit/${job?._id}`)
                        }
                      />

                      <MoreHorizontal
                        size={20}
                        className="cursor-pointer hover:text-gray-600"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-8 text-gray-500 italic"
                >
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
