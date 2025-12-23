"use client";
import { useState, useEffect } from "react";
import { getJobsByStatus } from "@/api"; 
import { Job } from "@/types/Job";

export default function ActiveJobs() {
  const [applications, setApplications] = useState<Job[]>([]);
  const [status, setStatus] = useState<string>("active");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getJobsByStatus(status); // <-- use function
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status, fetchApplications]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Active Job Applications</h1>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="rejected">Rejected</option>
        <option value="all">All</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Job Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="border px-4 py-2">{app.title}</td>
                <td className="border px-4 py-2">{app.status}</td>
                <td className="border px-4 py-2">
                  {app.expiry ? new Date(app.expiry).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
