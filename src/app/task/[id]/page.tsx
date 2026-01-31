"use client";

import { useParams } from "next/navigation";
import TaskDetails from "@/features/task/components/TaskDetails";

export default function TaskDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <TaskDetails taskId={id} />
    </div>
  );
}
