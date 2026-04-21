"use client";

import { SiGithub } from "react-icons/si";
import {
  FiExternalLink,
  FiMapPin,
  FiLink,
  FiTwitter,
} from "react-icons/fi";
import { useGithub } from "../hooks/useProfileApi";

interface Props {
  githubUrl?: string;
}

export default function GitHubStatsSection({ githubUrl }: Props) {
  const username =
    githubUrl?.trim().replace(/\/$/, "").split("/").pop() || "";

  const { data: githubData, isLoading, error } = useGithub(username);

  const joinedYear = githubData?.created_at
    ? new Date(githubData.created_at).getFullYear()
    : null;

  return (
    <div className="space-y-4 sm:space-y-6 border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
          <SiGithub className="text-lg sm:text-xl" />
          GitHub Stats
        </h2>

        {githubData?.login && (
          <a
            href={`https://github.com/${githubData.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <FiExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        )}
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 gap-2 text-gray-500">
          <SiGithub className="w-4 h-4 animate-pulse" />
          <span className="text-xs sm:text-sm italic">
            Fetching GitHub profile...
          </span>
        </div>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <p className="text-red-500 text-xs sm:text-sm bg-red-50 rounded-lg px-3 py-2">
          {error instanceof Error
            ? error.message
            : "Failed to load GitHub data"}
        </p>
      )}

      {/* PROFILE */}
      {githubData && !isLoading && (
        <div className="space-y-4 sm:space-y-5">

          {/* USER INFO */}
          <div className="flex gap-3 sm:gap-4 items-start">
            <img
              src={githubData.avatar_url}
              alt={githubData.name || githubData.login}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border object-cover shrink-0"
            />

            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">
                {githubData.name || githubData.login}
              </p>

              {githubData.bio && (
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                  {githubData.bio}
                </p>
              )}

              {githubData.location && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <FiMapPin className="w-3 h-3" />
                  {githubData.location}
                </p>
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Stat label="Repos" value={githubData.public_repos} />
            <Stat label="Followers" value={githubData.followers} />
            <Stat label="Following" value={githubData.following} />
            <Stat label="Gists" value={githubData.public_gists} />
          </div>

          {/* LINKS */}
          <div className="space-y-2 text-xs sm:text-sm">
            {githubData.blog && (
              <a
                href={
                  githubData.blog.startsWith("http")
                    ? githubData.blog
                    : `https://${githubData.blog}`
                }
                target="_blank"
                className="text-blue-600 flex items-center gap-2 break-all"
              >
                <FiLink /> {githubData.blog}
              </a>
            )}

            {githubData.twitter_username && (
              <a
                href={`https://twitter.com/${githubData.twitter_username}`}
                target="_blank"
                className="text-blue-600 flex items-center gap-2"
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

/* STAT CARD */
const Stat = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="bg-gray-50 rounded-lg py-2 sm:py-3 text-center">
    <p className="font-semibold text-sm sm:text-base">{value}</p>
    <p className="text-[10px] sm:text-xs text-gray-500">{label}</p>
  </div>
);