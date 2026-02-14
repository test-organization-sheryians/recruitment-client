"use client";

import { useState, FormEvent } from "react";

interface ProductFormProps {
  onSubmit: (data: { name: string; price: number }) => void;
}

export default function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !price) return;

    onSubmit({ name, price: Number(price) });

    setName("");
    setPrice("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex gap-3 mb-6 bg-white p-4 rounded-xl shadow"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg"
        placeholder="Product name"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-40 px-4 py-2 border rounded-lg"
        placeholder="Price"
      />

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
        Add
      </button>
    </form>
  );
}
