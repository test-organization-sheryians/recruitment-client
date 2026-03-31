"use client";

import { useRouter } from "next/navigation";
import { useFetchedAllProducts } from "../hooks/useProductApi";

const AllProducts = () => {
    const { data, isLoading } = useFetchedAllProducts();
    const router = useRouter();

    if (isLoading) {
        return <div className="text-center mt-10">Loading products...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data?.result.map((product: any) => (
                    <div
                        key={product._id}
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="text-lg font-semibold mb-2">
                            {product.title}
                        </h2>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description || "No description"}
                        </p>

                        <div className="text-black font-bold mb-2">
                            ₹{product.price}
                        </div>

                        <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded">
                            {product.category}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProducts;