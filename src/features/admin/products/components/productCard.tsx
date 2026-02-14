"use client";

import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onView,
}: ProductCardProps) {
  return (
    <div
      className="
        bg-white border border-[#BBCFFF] rounded-2xl p-5 shadow-sm
        hover:shadow-md transition-all duration-200
        flex flex-col gap-2
      "
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm">
        ₹{product.price}
      </p>

      <p className="text-gray-600 text-sm">
        Quantity: {product.quantity}
      </p>

      {product.description && (
        <p className="text-gray-500 text-sm">
          {product.description}
        </p>
      )}

      <div className="flex gap-3 mt-3">
        {onView && (
          <button
            onClick={() => onView(product._id)}
            className="
              flex items-center gap-1 px-3 py-1.5 text-sm
              bg-green-500 text-white rounded-lg
              hover:bg-green-600 transition
            "
          >
            <FiEye size={14} />
            View
          </button>
        )}
        <button
          onClick={() => onEdit(product._id)}
          className="
            flex items-center gap-1 px-3 py-1.5 text-sm
            bg-[#3668FF] text-white rounded-lg
            hover:bg-[#254BAA] transition
          "
        >
          <FiEdit2 size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(product._id)}
          className="
            flex items-center gap-1 px-3 py-1.5 text-sm
            bg-red-500 text-white rounded-lg
            hover:bg-red-600 transition
          "
        >
          <FiTrash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
