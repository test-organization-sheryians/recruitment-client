"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddJobCategory } from "../hooks/useJobCategoryApi";
import { CategoryError } from "../../../../types/JobCategeory";
import { useToast } from "../../../../components/ui/Toast";
import { X } from "lucide-react";

type AddCategoryProps = {
  close: () => void;
};

const AddCategory: React.FC<AddCategoryProps> = ({ close }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { mutate: addCategory, isPending, error } = useAddJobCategory();

  useEffect(() => {
    if (error) {
      showError(
        (error as CategoryError)?.response?.data?.message ||
          "Failed to add category",
      );
    }
  }, [error, showError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCategory(
      { name: name.trim() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
          success("Category added successfully!");
          setName("");
          close();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Add Category
          </h2>
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {(error as CategoryError)?.response?.data?.message ||
                "Error adding category"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={close}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                disabled={isPending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
