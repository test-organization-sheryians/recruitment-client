"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddJobCategory } from "../hooks/useJobCategoryApi";
import { CategoryError } from "../types";

type AddCategoryProps = {
  close: () => void;
};

const AddCategory: React.FC<AddCategoryProps> = ({ close }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { mutate: addCategory, isPending, error } = useAddJobCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCategory(
      { name: name.trim() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
          alert("Category added successfully!");
          setName("");
          close();
        },
        onError: (err: CategoryError) => {
          const message = err?.response?.data?.message || "Error adding category";
          alert(message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-[36vw]">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {(error as CategoryError)?.response?.data?.message || "Error adding category"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border p-2 w-full mb-4 rounded-md"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;