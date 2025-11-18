"use client";

import { Plus, Pencil, MoreHorizontal } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Job() {
  const router = useRouter();

  return (
    <div className="w-full p-6">
      {/* Top Header Section */}
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

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Education</th>
              <th className="p-4 font-medium">Experience</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Skills</th>
              <th className="p-4 font-medium">expiry</th>
              <th className="p-4 font-medium">createdBy</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            <tr className="border-t">
              <td className="p-4 font-semibold">Frontend Developer</td>
              <td className="p-4">BCA</td>
              <td className="p-4">Full-time</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                  Active    
                </span>
              </td>
              <td className="p-4 flex items-center gap-3">
                <Pencil size={18} className="text-blue-600 cursor-pointer" />
                <MoreHorizontal size={20} className="cursor-pointer" />
              </td>
            </tr>

            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500 italic">
                No jobs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
