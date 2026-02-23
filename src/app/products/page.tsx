"use client"

import ProductCard from "@/features/product/components/ProductCard";
import { useProducts } from "@/features/product/hooks/useProduct";

export default function ProdcutPage() {
  const { products, deleteProduct } = useProducts();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onDelete={deleteProduct} />
      ))}
    </div>
  );
}