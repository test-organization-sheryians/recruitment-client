"use client";

import { Book } from "@/features/Rbooks/types/book";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
        <p className="text-sm text-gray-500">by {book.author}</p>

        <div className="mt-3 space-y-1 text-sm">
          <p><b>Category:</b> {book.category}</p>
          <p><b>Price:</b> ₹{book.price}</p>
          <p><b>Stock:</b> {book.stock}</p>
          <p className={`font-medium ${book.isAvailable ? "text-green-600" : "text-red-500"}`}>
            {book.isAvailable ? "Available" : "Out of stock"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 flex items-center justify-center gap-1 text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          <Pencil size={16} /> Edit
        </button>

        <button
          onClick={() => onDelete(book._id!)}
          className="flex-1 flex items-center justify-center gap-1 text-sm bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
