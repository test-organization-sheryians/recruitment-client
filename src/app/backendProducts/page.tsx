"use client";

import { useState } from "react";
import ProductList from "@/features/backendProducts/components/BackendProducts";
import CreateProductForm from "../../features/backendProducts/components/CreateProduct"; // Adjust this path to your form

const ProductPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            {showForm ? "Add New Product" : "Our Shop"}
          </h1>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showForm 
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {showForm ? "← Back to Shop" : "+ Create Product"}
          </button>
        </div>

        {/* Conditional Rendering */}
        {showForm ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CreateProductForm /> 
          </div>
        ) : (
          <ProductList />
        )}
      </div>
    </main>
  );
};

export default ProductPage;