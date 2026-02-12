import { useState } from "react";
import { Book } from "@/features/Rbooks/types/book";

export type BookFormData = Omit<Book, "_id">;

export const useBookForm = (
  initialData?: Book,
  onSubmit?: (data: BookFormData) => void
) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [price, setPrice] = useState(initialData?.price || 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: BookFormData = { title, author, price };

    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form submitted (no handler):", data);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPrice(0);
  };

  return {
    title,
    author,
    price,
    setTitle,
    setAuthor,
    setPrice,
    handleSubmit,
  };
};
