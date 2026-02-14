"use client";

import ProductCard from "./productCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
}

interface ProductListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
