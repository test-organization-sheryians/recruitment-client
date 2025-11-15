import React from "react";

type Props = {
  title: string;
  count: number | string;
  icon?: React.ReactNode;
  change?: string;
  changeTone?: "up" | "down";
};

export default function KpiCard({
  title,
  count,
  icon,
  change,
  changeTone,
}: Props) {
  const chip =
    changeTone === "up"
      ? "bg-green-100 text-green-700"
      : changeTone === "down"
      ? "bg-red-100 text-red-600"
      : "bg-gray-100 text-gray-600";

  return (
    <div className='rounded-2xl bg-white p-4 border border-gray-200 flex items-start justify-between'>
      <div>
        <p className='text-xs text-gray-500'>{title}</p>
        <p className='mt-2 text-2xl font-semibold'>{count}</p>
        {change && (
          <span
            className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${chip}`}
          >
            {change}
          </span>
        )}
      </div>
      <div className='w-10 h-10 rounded-xl bg-gray-50 grid place-items-center'>
        {icon ?? "📄"}
      </div>
    </div>
  );
}
