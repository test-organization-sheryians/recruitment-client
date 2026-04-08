"use client";

import { useState } from "react";
import { Category } from "@/api/categoriess/getCategoriess";
import UpdateCategoryForm from "./UpdateCategoryForm";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onUpdate: (data: { id: string; name: string }) => void;
  isUpdating: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function CategoryList({
  categories,
  isLoading,
  onUpdate,
  isUpdating,
  onDelete,
  isDeleting,
}: CategoryListProps) {
  const [editId, setEditId] = useState<string | null>(null);

  if (isLoading) {
    return <p className="text-gray-500 mt-6">Loading categories...</p>;
  }

  return (
    <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="w-full max-w-sm mx-auto p-5 bg-white border rounded-xl
                     shadow-sm hover:shadow-md transition"
        >
          {editId === cat._id ? (
            <UpdateCategoryForm
              initialName={cat.name}
              isSubmitting={isUpdating}
              onSubmit={(data) => {
                onUpdate({ id: cat._id, name: data.name });
                setEditId(null);
              }}
            />
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                {cat.name}
              </h3>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setEditId(cat._id)}
                  className="flex items-center gap-2 text-blue-600 text-sm
                             hover:underline"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(cat._id)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 text-red-600 text-sm
                             hover:underline disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
