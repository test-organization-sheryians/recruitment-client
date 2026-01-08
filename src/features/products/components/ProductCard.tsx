import { Product } from "../types/product.types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="font-bold mt-2">₹ {product.price}</p>
    </div>
  );
}
