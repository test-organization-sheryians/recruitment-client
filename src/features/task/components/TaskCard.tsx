"use client";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Task } from "@/api/task/getAll";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useUpdateTask } from "../hooks/useUpdateTask";
import TaskUpdateForm from "./TaskUpdateForm";
import { useRouter } from "next/navigation";

export default function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const router = useRouter()

  const handleUpdate = (data: {
    title: string;
    status: Task["status"];
  }) => {
    updateTask(
      { id: task._id, ...data },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  if (isEditing) {
    return (
      <div 
      className="p-4 border rounded-xl bg-gray-50">
        <TaskUpdateForm
          initialTitle={task.title}
          initialStatus={task.status}
          isSubmitting={isUpdating}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.title}</h3>

        <div className="flex gap-3">
          <button onClick={() => setIsEditing(true)}>
            <FiEdit2 />
          </button>

          <button
            onClick={() => deleteTask(task._id)}
            disabled={isDeleting}
            className="text-red-600"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}

      <span className="text-xs text-gray-400">
        Status: {task.status}
      </span>
      <button
  onClick={() => router.push(`/task/${task._id}`)}
  className="text-blue-500 text-sm"
>
  View Details →
</button>

    </div>
  );
}
