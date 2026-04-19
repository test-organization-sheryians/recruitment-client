"use client";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AddCategory from "./components/AddCategory";
import CategoryCard from "./components/CategoryCard";
import {
  useDeleteJobCategory,
  useUpdateJobCategory,
} from "./hooks/useJobCategoryApi";
import { useInfiniteJobCategories } from "@/features/candidate/categories/hooks/useInfiniteCategories";
import { JobCategory, CategoryError } from "../../../types/JobCategeory";
import { useToast } from "../../../components/ui/Toast";

const CategoriesBox = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobCategories();

  const categories = data ? data.pages.flatMap((p) => p.data) : [];
  const totalRecords =
    data?.pages?.[0]?.pagination?.totalRecords ?? categories.length;

  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteJobCategory();

  const { mutate: updateCategory, error: updateError } = useUpdateJobCategory();

  useEffect(() => {
    if (deleteError) {
      showError(
        (deleteError as CategoryError)?.response?.data?.message ||
          "Failed to delete category",
      );
    }
    if (updateError) {
      showError(
        (updateError as CategoryError)?.response?.data?.message ||
          "Failed to update category",
      );
    }
  }, [deleteError, updateError, showError]);

  const handleUpdate = (data: { id: string; name: string }) => {
    updateCategory(data, {
      onSuccess: () => {
        success("Category updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteCategory(id, {
      onSuccess: () => {
        success("Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
      },
    });
  };

  return (
    <div className="h-auto w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Job Category
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize your job categories.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            + Add New Category
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            Failed to load categories:{" "}
            {(error as CategoryError)?.message || "Unknown error"}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                  No categories found.
                </div>
              )}

              {categories.map((cat: JobCategory) => (
                <CategoryCard
                  key={cat._id || cat.name}
                  category={cat}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            <div className="col-span-full mt-5 flex justify-center">
              {hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              ) : (
                <div className="text-center text-xs text-gray-400">
                  {categories.length === 0
                    ? ""
                    : `Showing all ${totalRecords} categories`}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {open && <AddCategory close={() => setOpen(false)} />}
    </div>
  );
};

export default CategoriesBox;
