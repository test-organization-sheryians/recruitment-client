"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProduct } from './hooks/useCreateProductHook'; // Adjust path to your hook
import { useQueryClient } from '@tanstack/react-query';
type ProductFormData = {
  name: string;
  description: string;
  price: number;
  seller: string;
  stock: number;
  ratings: number;
};
export default function CreateProductForm() {
  const queryClient=useQueryClient()
  const { mutate, isPending } = useCreateProduct();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      stock: 0,
      ratings: 0
    }
  });

  const onSubmit = (data: ProductFormData) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
        alert("Product created successfully!");
        reset(); // Clear the form
      },
      onError: (err) => {
        alert(`Error: ${err.message}`);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Medical Product</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="e.g. Digital Infrared Thermometer"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Detailed clinical specifications..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition min-h-25"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
        </div>

        {/* Price & Seller Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
      <input
        {...register("price", { 
          required: "Price is required", 
          valueAsNumber: true // CRITICAL: This converts the string input to a number
        })}
        type="number"
        placeholder="0.00"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
      />
      {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price.message}</p>}
    </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Seller Name</label>
            <input
              {...register("seller", { required: "Seller name is required" })}
              placeholder="e.g. Global Health"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.seller && <p className="text-red-500 text-xs mt-1 font-medium">{errors.seller.message}</p>}
          </div>
        </div>

        {/* Stock & Ratings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
            <input
              {...register("stock", { required: "Stock is required", valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stock.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ratings (0-5)</label>
            <input
              {...register("ratings", { 
                required: "Rating is required", 
                valueAsNumber: true,
                min: { value: 0, message: "Min 0" },
                max: { value: 5, message: "Max 5" }
              })}
              step="0.1"
              type="number"
              placeholder="4.5"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.ratings && <p className="text-red-500 text-xs mt-1 font-medium">{errors.ratings.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
            isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          }`}
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            "List Product"
          )}
        </button>
      </form>
    </div>
  );
}