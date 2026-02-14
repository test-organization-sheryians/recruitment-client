"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiLoader, FiX } from "react-icons/fi";

interface ProductFormProps {
  onSubmit: (data: {
    name: string;
    price: number;
    description?: string;
    quantity: number;
  }) => void;
  isSubmitting?: boolean;
  submitText?: string;
  initialValues?: {
    name: string;
    price: number;
    description?: string;
    quantity: number;
  };
  onCancel?: () => void;
}

export default function ProductForm({
  onSubmit,
  isSubmitting = false,
  submitText = "Add Product",
  initialValues,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "1",
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        price: initialValues.price.toString(),
        description: initialValues.description || "",
        quantity: initialValues.quantity.toString(),
      });
    } else {
      setForm({
        name: "",
        price: "",
        description: "",
        quantity: "1",
      });
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      price: Number(form.price),
      description: form.description.trim() || undefined,
      quantity: Number(form.quantity),
    });

    if (!initialValues) {
      setForm({
        name: "",
        price: "",
        description: "",
        quantity: "1",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      {/* Product Name */}
      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        placeholder="Product Name"
        disabled={isSubmitting}
        className="
          w-full px-4 py-3 text-gray-800 text-base
          border border-[#BBCFFF] rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />

      {/* Price */}
      <input
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        placeholder="Price"
        disabled={isSubmitting}
        className="
          w-full px-4 py-3 text-gray-800 text-base
          border border-[#BBCFFF] rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />

      {/* Quantity */}
      <input
        type="number"
        min={1}
        value={form.quantity}
        onChange={(e) =>
          setForm({ ...form, quantity: e.target.value })
        }
        placeholder="Quantity"
        disabled={isSubmitting}
        className="
          w-full px-4 py-3 text-gray-800 text-base
          border border-[#BBCFFF] rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />

      {/* Description */}
      <input
        type="text"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        placeholder="Description (optional)"
        disabled={isSubmitting}
        className="
          w-full px-4 py-3 text-gray-800 text-base
          border border-[#BBCFFF] rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          !form.name.trim() ||
          !form.price ||
          !form.quantity
        }
        className="
          w-full py-3.5 bg-[#3668FF] text-white font-semibold rounded-xl shadow-lg
          hover:bg-[#254BAA] active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#3668FF]
          flex items-center justify-center gap-2
          transition-all duration-200
        "
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" size={20} />
            Saving...
          </>
        ) : (
          <>
            <FiPlus size={20} />
            {submitText}
          </>
        )}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="
            w-full py-3.5 bg-gray-500 text-white font-semibold rounded-xl shadow-lg
            hover:bg-gray-600 active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-500
            flex items-center justify-center gap-2
            transition-all duration-200
          "
        >
          <FiX size={20} />
          Cancel
        </button>
      )}
    </form>
  );
}
