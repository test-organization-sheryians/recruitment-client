"use client";

import { useGetTaskById } from "../hooks/useGetTaskById";

interface TaskDetailsProps {
  taskId: string;
}

export default function TaskDetails({ taskId }: TaskDetailsProps) {
  const { data, isLoading, isError } = useGetTaskById(taskId);

  if (isLoading) {
    return <p>Loading task...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-500">Failed to load task</p>;
  }

  return (
    <div className="p-5 border rounded-xl bg-white shadow-sm flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{data.title}</h2>

      {data.description && (
        <p className="text-gray-600">{data.description}</p>
      )}

      <span className="text-sm text-gray-500">
        Status: {data.status}
      </span>

      <span className="text-xs text-gray-400">
        Created: {new Date(data.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
