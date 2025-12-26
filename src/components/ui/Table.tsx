"use client";

import React from "react";

export type Column<T> = {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  // rowKey can be a key name or a function that returns string | number | undefined
  rowKey?: keyof T | ((item: T) => string | number | undefined);
  loadMoreRef?: React.RefObject<unknown>;
  isFetchingNextPage?: boolean;
  emptyMessage?: string;
}

export default function Table<T extends object>({
  columns,
  data,
  rowKey,
  loadMoreRef,
  isFetchingNextPage,
  emptyMessage = "No records found",
}: TableProps<T>) {
  const getRowKey = (item: T, index: number) => {
    let key: string | number | undefined;

    if (typeof rowKey === "function") {
      key = rowKey(item);
    } else if (typeof rowKey === "string") {
      // rowKey provided as a key name
      const obj = item as Record<string, unknown>;
      key = obj[String(rowKey)] as string | number | undefined;
    }

    // If key is missing, try common id fields
    if (key === undefined || key === null || key === "") {
      const obj = item as Record<string, unknown>;
      const maybeId = obj["_id"] ?? obj["id"];
      if (maybeId !== undefined && maybeId !== null && maybeId !== "") {
        return String(maybeId);
      }

      return String(index);
    }

    return String(key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-3 border-b text-left text-sm font-medium text-gray-700 ${
                  col.align === "center" ? "text-center" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500 border-b">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={getRowKey(item, idx)} className="hover:bg-gray-50">
                {columns.map((col, cidx) => (
                  <td key={cidx} className="px-6 py-4 border-b">
                    {col.render ? col.render(item) : ((item[col.accessor as keyof T] as unknown) as React.ReactNode) ?? ""}
                  </td>
                ))}
              </tr>
            ))
          )}

          {/* Infinite scroll sentinel row */}
          <tr ref={loadMoreRef as React.RefObject<HTMLTableRowElement>}>
            <td colSpan={columns.length} className="p-0 h-4" />
          </tr>

          {isFetchingNextPage && (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                <svg className="animate-spin w-4 h-4 mx-auto" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                <span className="ml-2">Loading more...</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
