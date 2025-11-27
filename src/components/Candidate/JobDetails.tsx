"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getJobs } from "@/api/jobs/getjobs";
import { Bookmark, ArrowLeft } from "lucide-react";

// Define TypeScript types
interface Category {
  _id: string;
  name: string;
}

interface Skill {
  _id?: string;
  name: string;
}

interface Job {
  _id: string;
  title: string;
  category?: Category;
  salary?: string;
  department?: string;
  requiredExperience?: string;
  education?: string;
  expiry?: string;
  description?: string;
  skills?: (Skill | string)[];
}

export default function JobDetails() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const data: Job = await getJobs(jobId);
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job)
    return (
      <p className="text-center mt-10 text-gray-500">
        Fetching job details...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl shadow-lg rounded-2xl p-6 space-y-5 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Job Title */}
        <h1 className="text-2xl font-bold mt-6">{job.title}</h1>

        {/* Save & Apply */}
        <div className="flex gap-3">
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
            <Bookmark size={20} className="text-gray-600" />
          </button>

          <button className="px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm font-semibold">
            Apply Now
          </button>
        </div>

        {/* Job Meta Info */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          {job.category?.name && (
            <p>
              <strong>Category:</strong> {job.category.name}
            </p>
          )}
          {job.salary && (
            <p>
              <strong>Salary:</strong> {job.salary}
            </p>
          )}
          {job.department && (
            <p>
              <strong>Department:</strong> {job.department}
            </p>
          )}
          {job.requiredExperience && (
            <p>
              <strong>Experience:</strong> {job.requiredExperience}
            </p>
          )}
          {job.education && (
            <p>
              <strong>Education:</strong> {job.education}
            </p>
          )}
          {job.expiry && (
            <p>
              <strong>Expiry:</strong>{" "}
              {new Date(job.expiry).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-1">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {job.description}
            </p>
          </div>
        )}

     {/* Skills */}
{(job.skills ?? []).length > 0 && (
  <div>
    <h2 className="font-semibold text-gray-800 mb-2">Skills Required</h2>
    <div className="flex flex-wrap gap-2">
      {(job.skills ?? []).map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
        >
          {typeof skill === "string" ? skill : skill?.name ?? "Unknown"}
        </span>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  );
}
