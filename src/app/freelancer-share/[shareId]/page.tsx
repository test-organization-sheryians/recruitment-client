"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FreelancerProfile {
  _id: string;
  userId: string;
  hourlyRate: number;
  availability: string;
  projects: Array<{ title: string; githubUrl?: string }>;
  user: { firstName: string; lastName: string; email: string };
}

export default function FreelancerSharePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [profiles, setProfiles] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shareId) {
      fetch(`http://localhost:9000/api/freelancer-share/${shareId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfiles(data.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load portfolios");
          setLoading(false);
        });
    }
  }, [shareId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">
            Loading Professional Portfolios...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl font-semibold text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Freelancer Profiles
          </h1>
          <p className="text-slate-500 text-lg">
            Share ID:{" "}
            <span className="font-semibold text-slate-700">{shareId}</span>
          </p>
          <p className="mt-2 text-slate-600">
            {profiles.length}{" "}
            {profiles.length === 1 ? "Freelancer" : "Freelancers"} Found
          </p>
        </div>

        {/* Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-8 hover:shadow-lg transition"
            >
              {/* Profile Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  {profile.user.firstName} {profile.user.lastName}
                </h2>
                <p className="text-slate-500">{profile.user.email}</p>
              </div>

              {/* Rate & Availability */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-800">
                  ₹{profile.hourlyRate}{" "}
                  <span className="text-base font-medium text-slate-500">
                    /hour
                  </span>
                </div>
                <div
                  className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-medium ${
                    profile.availability === "immediate"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile.availability === "immediate"
                    ? "Available Immediately"
                    : "Available Soon"}
                </div>
              </div>

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">
                    Projects
                  </h3>
                  <ul className="space-y-2">
                    {profile.projects.slice(0, 3).map((project, idx) => (
                      <li key={idx} className="text-slate-600">
                        {project.title}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            className="ml-3 text-blue-600 hover:underline text-sm"
                          >
                            View Code
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <a
                  href={`mailto:${profile.user.email}?subject=Hiring%20Opportunity`}
                  className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-center hover:bg-slate-700 transition"
                >
                  Hire
                </a>
                <a
                  href={`mailto:${profile.user.email}`}
                  className="flex-1 border border-slate-400 text-slate-700 py-2 rounded-lg text-center hover:bg-slate-100 transition"
                >
                  Message
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
