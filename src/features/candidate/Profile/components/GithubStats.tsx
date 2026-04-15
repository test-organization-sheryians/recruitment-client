"use client";

import { SiGithub } from "react-icons/si";
import { FiExternalLink, FiUsers, FiBookOpen, FiMapPin, FiLink, FiTwitter } from "react-icons/fi";
import { useGithub } from "../hooks/useProfileApi";


interface Props {
  githubUrl?: string;
}

export default function GitHubStatsSection({ githubUrl }: Props) {
  const username = githubUrl?.trim().replace(/\/$/, "").split("/").pop() || "";

  const { data: githubData, isLoading, error } = useGithub(username);

  const joinedYear = githubData?.created_at
    ? new Date(githubData.created_at).getFullYear()
    : null;

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-6 bg-white shadow-md">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
         
        <h2 className="text-xl font-bold text-gray-800 flex justify-center items-center gap-2"><SiGithub className="text-xl" />GitHub Stats</h2>
        {githubData?.login && (
          <a
            href={`https://github.com/${githubData.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
          >
            <FiExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
          <SiGithub className="w-5 h-5 animate-pulse" />
          <span className="text-sm italic">Fetching GitHub profile...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <p className="text-red-500 italic py-4 bg-red-50 rounded-lg px-4 text-sm">
          {error instanceof Error ? error.message : "Failed to load GitHub data"}
        </p>
      )}

      {/* Profile */}
      {githubData && !isLoading && (
        <div className="space-y-5">
          
          {/* User Info */}
          <div className="flex items-center gap-4">
            <img
              src={githubData.avatar_url}
              alt={githubData.name || githubData.login}
              className="w-14 h-14 rounded-full border object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">
                {githubData.name || githubData.login}
              </p>
              {githubData.bio && (
                <p className="text-sm text-gray-500">{githubData.bio}</p>
              )}
              {githubData.location && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3" />
                  {githubData.location}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <Stat label="Repos" value={githubData.public_repos} />
            <Stat label="Followers" value={githubData.followers} />
            <Stat label="Following" value={githubData.following} />
            <Stat label="Gists" value={githubData.public_gists} />
          </div>

          {/* Links */}
          <div className="space-y-2">
            {githubData.blog && (
              <a
                href={githubData.blog.startsWith("http") ? githubData.blog : `https://${githubData.blog}`}
                target="_blank"
                className="text-blue-600 text-sm flex gap-2"
              >
                <FiLink /> {githubData.blog}
              </a>
            )}

            {githubData.twitter_username && (
              <a
                href={`https://twitter.com/${githubData.twitter_username}`}
                target="_blank"
                className="text-blue-600 text-sm flex gap-2"
              >
                <FiTwitter /> @{githubData.twitter_username}
              </a>
            )}

            {joinedYear && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <SiGithub className="w-3 h-3" />
                Joined {joinedYear}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-gray-50 rounded-lg py-3 text-center">
    <p className="font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);