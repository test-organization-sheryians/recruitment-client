"use client";

import React, { useState, useRef, useEffect } from "react";

export type SelectOption = {
    _id: string;
    name: string;
};

type JobSelectProps = {
    label: React.ReactNode;
    value: string;
    options: SelectOption[];
    onChange: (v: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    isCompact?: boolean;
};

/**
 * Shared dropdown select component used across job create/edit forms.
 * Supports infinite-scroll load-more for large option lists (e.g. categories).
 */
export function JobSelect({
    label,
    value,
    options,
    onChange,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    isCompact = false,
}: JobSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selected = options.find((o) => o._id === value);

    return (
        <div className="flex flex-col gap-1.5" ref={ref}>
            {label && (
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((s) => !s)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                    <span className={selected ? "" : "text-gray-400"}>
                        {selected ? selected.name : "Select"}
                    </span>
                    <svg
                        className={`w-4 h-4 ml-2 transform transition ${open ? "rotate-180" : "rotate-0"}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 8l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {open && (
                    <ul
                        role="listbox"
                        tabIndex={-1}
                        onScroll={(e) => {
                            const target = e.currentTarget;
                            if (!onLoadMore || !hasMore) return;
                            if (target.scrollTop + target.clientHeight >= target.scrollHeight - 8) {
                                if (!isLoadingMore) onLoadMore();
                            }
                        }}
                        className="absolute z-40 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border border-[#dbdde6] dark:border-gray-700 shadow-lg max-h-48 overflow-auto"
                    >
                        <li>
                            <button
                                type="button"
                                onClick={() => { onChange(""); setOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm ${!value
                                        ? "font-semibold text-[#111218] dark:text-white"
                                        : "text-gray-600 dark:text-gray-200"
                                    } cursor-pointer`}
                            >
                                Select
                            </button>
                        </li>
                        {options.map((c) => (
                            <li key={c._id}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(c._id); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${value === c._id
                                            ? "bg-[#2b4bee] text-white"
                                            : "text-gray-700 dark:text-gray-200"
                                        } cursor-pointer`}
                                >
                                    {c.name}
                                </button>
                            </li>
                        ))}
                        {isLoadingMore && (
                            <li className="px-4 py-2 text-sm text-gray-400 text-center">
                                Loading more...
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
