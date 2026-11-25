"use client";

import ProductForm from "@/features/admin/products/components/ProductForm";
import ProductList from "@/features/admin/products/components/ProductList";

import {
  useGetAllProducts,
  useCreateProduct,
  useDeleteProduct,
} from "@/features/admin/products/hooks/useProductApi";

export default function ProductPage() {
  const { data } = useGetAllProducts();

  // depends on backend response
  const products = data?.data || data || [];

  const { mutate: createProduct } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Products</h1>

      <ProductForm onSubmit={createProduct} />

      <ProductList
        products={products}
        onDelete={deleteProduct}
      />
    </div>
  );
}
