"use client";

import TaskCard from "./TaskCard";
import { useGetTasks } from "../hooks/useGetTasks";

export default function TaskList() {
  const { data, isLoading, isError } = useGetTasks();

  if (isLoading) {
    return <p className="text-center">Loading tasks...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load tasks</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No tasks found</p>;
  }

  return (
    <div className="grid gap-4 mt-6">
      {data.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
