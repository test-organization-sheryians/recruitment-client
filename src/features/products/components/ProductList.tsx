"use client";

import { useState } from "react";
import { useGetProducts } from "../hooks/useGetProduct";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

export default function ProductsList() {
  const { data, isLoading } = useGetProducts();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProduct } = useUpdateProduct();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");

  if (isLoading) return <p>Loading...</p>;

  const handleCreate = () => {
    createProduct({ title, price: Number(price) });
    setTitle("");
    setPrice("");
  };

  const handleUpdate = () => {
    if (!editId) return;

    updateProduct({
      id: editId,
      data: { title: editTitle, price: Number(editPrice) },
    });

    setEditId(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      {/* CREATE */}
      <div className="space-x-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-2 gap-4">
        {data?.map((product: any) => (
          <div key={product._id} className="border p-4 rounded space-y-2">
            {editId === product._id ? (
              <>
                {/* EDIT MODE */}
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-1 w-full"
                />
                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="border p-1 w-full"
                />

                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-3 py-1"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditId(null)}
                  className="ml-2 text-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* NORMAL VIEW */}
                <h2>{product.title}</h2>
                <p>₹{product.price}</p>

                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditId(product._id);
                      setEditTitle(product.title);
                      setEditPrice(product.price);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
