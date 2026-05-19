import ProductList from "@/features/products/components/product";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Our Shop
        </h1>
        
        {/* This calls your unified product.tsx file */}
        <ProductList />
      </div>
    </main>
  );
}