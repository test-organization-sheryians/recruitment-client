"use client";

import TaskForm from "@/features/task/components/TaskForm";
import TaskList from "@/features/task/components/TaskList";
import { useCreateTask } from "@/features/task/hooks/useCreateTask";

export default function TaskPage() {
  const { mutate, isPending } = useCreateTask();

  return (
    <div className="max-w-md mx-auto mt-10">
      <TaskForm
        onSubmit={(data) => mutate(data)}
        isSubmitting={isPending}
      />
      <TaskList/>
    </div>
  );
}
