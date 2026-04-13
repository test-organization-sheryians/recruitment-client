"use client";

import { Mail, Phone, Printer, User } from "lucide-react";

import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { useProfileDetails } from "../hooks/useShareuser";
import GitHubStatsSection from "@/features/candidate/Profile/components/GithubStats";
import LeetCodeStatsSection from "@/features/candidate/Profile/components/LeetcodeStats";

const UserDetails = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useProfileDetails(id);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading user</div>;

  const user = data?.data;

  const formatAvailability = (value: string) =>
    value ? value.replace("_", " ").toUpperCase() : "-";

  const handlePrintResume = () => {
    if (user?.resumeFile) {
      const win = window.open(user.resumeFile, "_blank");
      win?.focus();

      // wait for PDF to load
      setTimeout(() => {
        win?.print();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 🔥 PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
              {user?.user?.firstName?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold">
                {user?.user?.firstName} {user?.user?.lastName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(user?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <hr className="my-5" />

          {/* CONTACT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              icon={<Mail size={16} />}
              label="EMAIL"
              value={user?.user?.email}
            />
            <Card
              icon={<Phone size={16} />}
              label="PHONE"
              value={user?.contactInfo?.phone}
            />
            <Card
              icon={<User size={16} />}
              label="AVAILABILITY"
              value={formatAvailability(user?.availability)}
            />
          </div>

          {/* SKILLS */}
          <Section title="Skills">
            {user?.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill: any) => (
                  <span
                    key={skill._id}
                    className="px-3 py-1 text-xs sm:text-sm bg-gray-100 rounded-full border"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <Empty text="No skills added" />
            )}
          </Section>

          {/* SOCIAL */}
          <Section title="Social Links">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <SocialBtn
                href={user?.socialLinks?.linkedin || user?.linkedinUrl}
                icon={<FaLinkedin className="text-blue-600" />}
                label="LinkedIn"
              />

              <SocialBtn
                href={user?.socialLinks?.github || user?.githubUrl}
                icon={<FaGithub className="text-black" />}
                label="Github"
              />

              <SocialBtn
                href={user?.socialLinks?.portfolio || user?.portfolioUrl}
                icon={<FaGlobe className="text-gray-700" />}
                label="Portfolio"
              />

              <SocialBtn
                href={user?.leetcodeUrl}
                icon={<SiLeetcode className="text-orange-500" />}
                label="LeetCode"
              />
            </div>
          </Section>

          {/* EXPERIENCE */}
          <Section title="Experience">
            {user?.experiences?.length ? (
              <div className="space-y-3">
                {user.experiences.map((exp: any) => (
                  <div
                    key={exp._id}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <p className="font-medium text-sm">{exp.title}</p>
                    <p className="text-xs text-gray-500">{exp.company}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text="No experience added" />
            )}
          </Section>

          {/* RESUME */}
          {/* <Section title="Resume">
            <div className="bg-white p-2 rounded-xl flex justify-center">
              {user?.resumeFile ? (
                <iframe
                  src={`${user.resumeFile}#toolbar=0&navpanes=0`}
                  className="w-full sm:w-[700px] lg:w-[800px] h-[400px] sm:h-[500px] rounded-lg bg-white shadow"
                />
              ) : (
                <Empty text="No resume available" />
              )}
            </div>
          </Section> */}

          <Section title="Resume">
            <div className="bg-white p-2 rounded-xl">
              {/* 🔥 ACTION BUTTONS */}
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={handlePrintResume}
                  className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-100 flex gap-2"
                >
                  <Printer size={16} />  <span>Print</span>
                </button>
               
              </div>

              {/* PDF */}
              <div className="flex justify-center">
                {user?.resumeFile ? (
                  <iframe
                    src={`${user.resumeFile}#toolbar=0&navpanes=0`}
                    className="w-full sm:w-[700px] lg:w-[800px] h-[400px] sm:h-[500px] rounded-lg shadow"
                  />
                ) : (
                  <Empty text="No resume available" />
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* 🔥 STATS SECTION (NOW CLEAN + RESPONSIVE) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {user?.githubUrl && (
            <div className="bg-white p-4">
              <GitHubStatsSection githubUrl={user.githubUrl} />
            </div>
          )}

          {user?.leetcodeUrl && (
            <div className="bg-white p-4 ">
              <LeetCodeStatsSection leetcodeUrl={user.leetcodeUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

/// 🔹 SMALL COMPONENTS

const Card = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
    {icon}
    <div>
      <p className="text-[10px] text-gray-500">{label}</p>
      <p className="text-sm font-medium break-all">{value || "-"}</p>
    </div>
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="mt-6">
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const Empty = ({ text }: any) => (
  <p className="text-gray-400 text-xs">{text}</p>
);

const SocialBtn = ({ href, icon, label }: any) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-100 transition"
    >
      {icon}
      {label}
    </a>
  );
};
