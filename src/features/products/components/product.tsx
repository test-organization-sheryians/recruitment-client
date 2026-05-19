"use client";

import axios from "axios";
import { useProducts } from "../hooks/useProduct";
import { Product } from "@/types/product"; // Ensure your interface is imported
import Link from "next/link";

// --- 1. THE ITEM COMPONENT (The "Plate") ---
function ProductItem({ product }: { product: Product }) {
  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition">
      <img 
        src={product.image} 
        alt={product.title} 
        className="h-40 w-full object-contain mb-4" 
      />
      <h3 className="font-bold text-sm line-clamp-1">{product.title}</h3>
      <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      
      {/* Dynamic Link for Routing */}
      <Link 
        href={`/products/${product.id}`}
        className="block mt-4 text-center bg-gray-900 text-white py-2 rounded text-xs"
      >
        View Details
      </Link>
    </div>
  );
}

// --- 2. THE MAIN LIST COMPONENT (The "Dining Hall") ---
export default function ProductList() {
  const { data, isLoading, isError, error, isSuccess } = useProducts();

  // Debugging log to check if data is coming
  if (data) {
    console.log("✅ Your data is:", data);
  }

  // Handle Loading
  if (isLoading) {
    return <div className="p-10 text-center font-bold animate-pulse">Fetching Products...</div>;
  }

  // Handle Error
  if (isError) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data || error.message
      : "Something went wrong";
    return <div className="p-10 text-red-500 text-center">Error: {errorMessage}</div>;
  }

  // Handle Success & Render
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {data?.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}