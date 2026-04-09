"use client";

import { FiExternalLink } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { useleetcode } from "../hooks/useProfileApi";

interface Props {
  leetcodeUrl?: string;
}

function CircularProgress({
  solved,
  total,
  color,
  trackColor = "#f3f4f6",
  size = 52,
  strokeWidth = 6,
}: {
  solved: number;
  total: number;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(solved / total, 1) : 0;
  const offset = circumference - pct * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

function TotalDonut({
  solved,
  total,
  size = 110,
}: {
  solved: number;
  total: number;
  size?: number;
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(solved / total, 1) : 0;
  const offset = circumference - pct * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <span className="text-2xl font-bold text-gray-800">{solved}</span>
        <span className="text-[11px] text-gray-400">/ {total.toLocaleString()}</span>
        <span className="text-[10px] text-gray-500 mt-0.5">solved</span>
      </div>
    </div>
  );
}

export default function LeetCodeStatsSection({ leetcodeUrl = "" }: Props) {
  const username =
    leetcodeUrl.trim().replace(/\/$/, "").split("/").filter(Boolean).pop() || "";

  if (!username) return null;

  const { data: leetData, isLoading, error } = useleetcode(username);

  const getCount = (difficulty: string): number => {
    if (!leetData?.submitStats?.acSubmissionNum) return 0;
    const stat = leetData.submitStats.acSubmissionNum.find(
      (s: { difficulty: string; count: number }) => s.difficulty === difficulty
    );
    return stat?.count ?? 0;
  };

  const totalSolved  = getCount("All");
  const easySolved   = getCount("Easy");
  const mediumSolved = getCount("Medium");
  const hardSolved   = getCount("Hard");

  const TOTAL_QUESTIONS = 3892;
  const TOTAL_EASY      = 935;
  const TOTAL_MEDIUM    = 2036;
  const TOTAL_HARD      = 921;

  const ranking = leetData?.profile?.ranking;
  const formatRanking = (rank: number) =>
    !rank || rank >= 5_000_001 ? "Unranked" : rank.toLocaleString();

  const difficulties = [
    { label: "Easy",   solved: easySolved,   total: TOTAL_EASY,   color: "#22c55e", textColor: "text-green-600"  },
    { label: "Medium", solved: mediumSolved,  total: TOTAL_MEDIUM, color: "#f59e0b", textColor: "text-amber-500"  },
    { label: "Hard",   solved: hardSolved,    total: TOTAL_HARD,   color: "#ef4444", textColor: "text-red-500"    },
  ];

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-6 bg-white shadow-md">

      {/* Header — title row */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SiLeetcode className="text-orange-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">LeetCode Stats</h2>
        </div>
        <a
          href={`https://leetcode.com/u/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
        >
          <FiExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Avatar + username — below the ruler */}
      {leetData && !isLoading && (
        <div className="flex items-center gap-3">
          {leetData.profile?.userAvatar ? (
            <img
              src={leetData.profile.userAvatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <SiLeetcode className="text-orange-500 text-xl" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {leetData.profile?.realName || username}
            </p>
            <p className="text-xs text-gray-400">@{username}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
          <SiLeetcode className="w-5 h-5 animate-pulse text-orange-500" />
          <span className="text-sm italic">Fetching LeetCode profile...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <p className="text-red-500 italic py-4 bg-red-50 rounded-lg px-4 text-sm">
          {error instanceof Error ? error.message : "Failed to load LeetCode data"}
        </p>
      )}

      {/* Stats */}
      {leetData && !isLoading && (
        <div className="space-y-5">

          {/* Total donut + difficulty rings */}
          <div className="flex items-center justify-around py-2">
            <TotalDonut solved={totalSolved} total={TOTAL_QUESTIONS} size={110} />

            <div className="flex flex-col gap-3">
              {difficulties.map(({ label, solved, total, color, textColor }) => (
                <div key={label} className="flex items-center gap-3">
                  <CircularProgress solved={solved} total={total} color={color} size={52} strokeWidth={6} />
                  <div>
                    <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
                    <p className="text-xs text-gray-500">
                      {solved} / {total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat pills */}
          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-gray-100">
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-3 px-2 text-center">
              <span className="text-sm font-bold text-gray-800 truncate w-full text-center">
                {formatRanking(ranking)}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Ranking</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-3 px-2 text-center">
              <span className="text-sm font-bold text-gray-800">
                {leetData.profile?.reputation ?? 0}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Reputation</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-3 px-2 text-center">
              <span className="text-sm font-bold text-gray-800">
                {leetData.profile?.contributionPoints ?? 1}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Contributions</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}