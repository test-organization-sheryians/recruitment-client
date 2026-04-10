import ProductList from "@/features/products/components/ProductList";

export const metadata = {
  title: "Products | Recruitment Client",
  description: "Browse all available products",
};

const ProductsPage = () => {
  return (
    <main>
      <ProductList />
    </main>
  );
};

export default ProductsPage;