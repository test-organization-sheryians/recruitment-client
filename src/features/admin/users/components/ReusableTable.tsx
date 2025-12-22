"use client";
import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyText?: string;
}

export function ReusableTable<T>({
  data,
  columns,
  emptyText = "No data found",
}: ReusableTableProps<T>) {
  return (
    <table className="min-w-full bg-white border rounded-lg shadow">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, index) => (
            <th
              key={index}
              className={`px-6 py-2 text-gray-700 border-b text-sm text-left ${col.className || ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-4 text-black-500 border-b rounded-lg"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-3 text-sm border-b ${col.className || ""}`}
                >
                  {col.render
                    ? col.render(row)
                    : col.accessor
                    ? String(row[col.accessor] ?? "")
                    : null}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
