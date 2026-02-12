
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Book } from "@/features/Rbooks/types/book";
import BookDashboard from "./BookDashboard";

interface BookFormProps {
  onSuccess?: () => void;
}

export default function BookForm({ onSuccess }: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");

  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: async (book: any) => {
      const response = await axios.post("http://localhost:9000/api/books", book);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onSuccess?.();
      setTitle("");
      setAuthor("");
      setPrice("");
    },
    

    onError: (error: any) => {
  const message =
    error?.response?.data?.message || "Something went wrong";

  if (error?.response?.status === 409) {
    alert("❌ book title already exists");
  } else {
    alert(message);
  }

  console.error("Create book error:", error);
},

  });

 
  // const isLoading = createBookMutation.status === "loading";
  const isLoading = createBookMutation.status === "pending";


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");

    const payload = {
      title,
      author,
      price: price ? Number(price) : undefined,
    
      isAvailable: true,
    };

    createBookMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          📚 Add New Book
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill the details to add a new book
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Book Title *
            </label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg py-2.5 font-semibold text-white transition
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isLoading ? "Saving Book..." : "➕ Add Book"}
          </button>
        </form>
      </div>
      <BookDashboard />


    </div>
  );
}
