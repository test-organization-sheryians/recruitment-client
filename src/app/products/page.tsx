"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import ProductList from "@/features/products/components/ProductList";

export default function ProductsPage() {
  const { data, isLoading } = useProducts();

  if (isLoading) return <p>Loading products...</p>;


  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ProductList products={data || []} />
    </div>
  );
}


