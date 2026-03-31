"use client";

import { useRouter } from "next/navigation";
import { useFetchedAllProducts } from "../hooks/useProductApi";

const AllProducts = () => {
    const { data, isLoading } = useFetchedAllProducts();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading products...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Products
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your products
                    </p>
                </div>

                <button
                    onClick={() => router.push("/create-product")}
                    className="bg-black text-white px-5 py-3 rounded-lg font-medium
          hover:bg-gray-800 transition shadow-sm"
                >
                    + Create Product
                </button>
            </div>

            {data?.result.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                    <p className="text-lg">No products found</p>
                    <button
                        onClick={() => router.push("/create-product")}
                        className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Create Your First Product
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                {data?.result.map((product: any) => (
                    <div
                        key={product._id}
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="cursor-pointer bg-white rounded-2xl border shadow-sm
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                            {product.title}
                        </h2>

                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {product.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-black">
                                ₹{product.price}
                            </span>

                            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                                {product.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProducts;