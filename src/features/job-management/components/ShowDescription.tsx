"use client";

import React from "react";

type ShowDescriptionProps = {
  html?: string;
  clamp?: number;
  maxHeight?: string;
  scrollable?: boolean;
  className?: string;
};

export default function ShowDescription({
  html,
  clamp,
  maxHeight,
  scrollable = false,
  className = "",
}: ShowDescriptionProps) {
  return (
    <div
      className={`
        bg-white border rounded-lg p-4
        text-sm text-gray-600 leading-relaxed
        max-w-none overflow-hidden

        [&_ul]:list-disc
        [&_ul]:pl-8
        [&_ul]:my-3

        [&_ol]:list-decimal
        [&_ol]:pl-8
        [&_ol]:my-3

        [&_li]:mb-2
        [&_li]:leading-relaxed

        [&_ul_ul]:list-circle
        [&_ol_ol]:list-[lower-alpha]

        [&_p]:my-2

        [&_strong]:font-semibold
        [&_b]:font-semibold

        [&_em]:italic
        [&_i]:italic

        [&_a]:text-blue-600
        [&_a]:underline
        hover:[&_a]:text-blue-700

        ${clamp ? `line-clamp-${clamp}` : ""}
        ${className}

         ${scrollable ? "overflow-y-auto" : ""}
        ${className}
      `}
      style={scrollable && maxHeight ? { maxHeight } : undefined}
      dangerouslySetInnerHTML={{
        __html: html || "<p>No description provided.</p>",
      }}
    />
  );
}
