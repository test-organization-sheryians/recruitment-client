"use client";

import { useProducts } from "./hooks/useGetAllProductsHooks";
import Link from "next/link";
import { backendProducts } from "@/types/backendProducts";
import { useState } from "react";
import DeleteProductButton from "./DeleteProduct";

export default function ProductList() {
  // Destructure everything you need from TanStack Query
  const { data: response, isLoading, isError, error, refetch } = useProducts();
  // 1. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div>
            <div
              key={i}
              className="h-64 bg-gray-300 animate-pulse rounded-xl"
            />
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="p-20 text-center">
        <p className="text-red-500 mb-4">Error: {(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. Success State
  // Extracting the array from your backend response structure
  const productList = response?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Medical Inventory ({productList.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productList.map((product: backendProducts) => (
          <div
            key={product._id}
            className="border p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-32 w-full bg-blue-50 rounded-lg mb-4 flex items-center justify-center text-blue-300 font-bold">
                {product.name?.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-800">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  ₹{product.price}
                </span>
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">
                  Qty: {product.stock}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 ">
              <Link
              href={`/backendProducts/singleProduct/${product._id}`}
              className="mt-4 block text-center bg-gray-900 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-800 transition"
            >
              View Details
            </Link>
            <Link
              href={`/backendProducts/updateProduct/${product._id}`}
              className="mt-4 block text-center bg-gray-900 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-800 transition"
            >
              Update
            </Link>
             <DeleteProductButton id={product._id} productName={product.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
