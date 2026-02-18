"use client";

import React from "react";

type ShowDescriptionProps = {
  html?: string;
  clamp?: number; // optional line clamp
  maxHeight?: string; // optional max height
  className?: string;
};

export default function ShowDescription({
  html,
  clamp,
  maxHeight = "12rem",
  className = "",
}: ShowDescriptionProps) {
  return (
    <div
      className={`
        job-description-content
        bg-white border rounded-lg p-4
        text-sm text-gray-600 leading-relaxed
        max-w-none overflow-hidden
        ${clamp ? `line-clamp-${clamp}` : ""}
        ${className}
      `}
      style={{ maxHeight }}
      dangerouslySetInnerHTML={{
        __html: html || "<p>No description provided.</p>",
      }}
    />
  );
}
