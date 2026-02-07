"use client";
import { toast } from "react-toastify";
import CategoryForm from "@/features/categoriess/components/CategoryForm";
import CategoryList from "@/features/categoriess/components/CategoryList";

import {
  useCreateCategory,
  useGetCategoriess,
  useUpdateCategory,
  useDeleteCategory,
} from "./hooks/useCategoriessApi";

export default function CategoriessBox() {
  const { data = [], isLoading } = useGetCategoriess();

  const { mutate: createCategory, isPending } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  return (
    <div className="w-full px-6 py-6">
      <CategoryForm
        isSubmitting={isPending}
        onSubmit={(data) =>
          createCategory(data, {
            onSuccess: () => {
              toast.success("Category created successfully 🎉");
            },
            onError: (error: unknown) => {
              const message =
                error instanceof Error
                  ? error.message
                  : "Failed to create category";

              toast.error(message);
            },
          })
        }
      />

      <CategoryList
        categories={data}
        isLoading={isLoading}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onUpdate={(payload) => updateCategory(payload)}
        onDelete={(id) => deleteCategory(id)}
      />
    </div>
  );
}
