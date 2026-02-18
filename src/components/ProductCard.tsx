"use client";
import { Product } from "@/types/product";
import { productAPI } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
}

export default function ProductCard({ product, onUpdate }: ProductCardProps) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isOwner = false; // TODO: Check owner from backend

  const handleDelete = async () => {
    if (!token || !confirm("Are you sure?")) return;

    try {
      await productAPI.delete(product._id, token);
      onUpdate();
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {product.name}
      </h3>
      <p className="text-2xl font-bold text-green-600 mb-4">₹{product.price}</p>
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {product.category || "General"}
        </span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>

      {isOwner && (
        <div className="flex space-x-2">
          <button className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700">
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
