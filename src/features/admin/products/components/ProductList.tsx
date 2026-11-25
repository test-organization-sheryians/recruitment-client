"use client";

import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductList({
  products,
  onDelete,
}: ProductListProps) {
  if (!products?.length) return <p>No products</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
