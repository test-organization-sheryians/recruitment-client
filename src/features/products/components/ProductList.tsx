"use client";

import { useState } from "react";
import { useProducts, useProductsByCategory, useCategories } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories = [] } = useCategories();

  const {
    data: allProducts = [],
    isLoading: allLoading,
    isError: allError,
  } = useProducts();

  const {
    data: categoryProducts = [],
    isLoading: categoryLoading,
    isError: categoryError,
  } = useProductsByCategory(selectedCategory);

  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? categoryLoading : allLoading;
  const isError = selectedCategory ? categoryError : allError;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 mt-1">Browse our latest collection</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === ""
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl h-80 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500">
          Something went wrong. Please try again.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No products found.
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;