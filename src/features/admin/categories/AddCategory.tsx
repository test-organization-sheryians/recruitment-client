"use client";
import api from "@/config/axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddCategoryProps = {
  close: () => void;
};

const AddCategory: React.FC<AddCategoryProps> = ({ close }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return api.post("/api/job-categories", data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job-categories"],
      });
      alert("Category added!");
      close();
    },

    onError: (err: any) => {
      alert(err.response?.data?.message || "Error adding category");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-[36vw]">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border p-2 w-full mb-4"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;