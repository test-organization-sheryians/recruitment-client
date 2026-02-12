"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookCard from "./BookCard";
import { Book } from "@/features/Rbooks/types/book";

const fetchBooks = async () => {
  const res = await axios.get("http://localhost:9000/api/books");
  return res.data.data;
};

const deleteBook = async (id: string) => {
  await axios.delete(`http://localhost:9000/api/books/${id}`);
};

export default function BookDashboard() {
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  if (isLoading) return <p>Loading books...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">📚 Books Dashboard</h2>

      {!books?.length && (
        <p className="text-gray-500">No books found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book: Book) => (
          <BookCard
            key={book._id}
            book={book}
            onEdit={(b) => console.log("EDIT:", b)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
