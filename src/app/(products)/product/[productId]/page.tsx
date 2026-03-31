"use client";

import UpdateProductForm from "@/features/product/components/UpdateProductForm";
import {
    useDeleteProduct,
    useFetchProductById,
} from "@/features/product/hooks/useProductApi";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ProductPage = () => {
    const queryClient = useQueryClient();
    const { productId } = useParams<{ productId: string }>();
    const { data, isLoading } = useFetchProductById(productId);

    const { mutate: deleteProduct } = useDeleteProduct();

    const [editing, setEditing] = useState(false);
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading product...
            </div>
        );
    }

    const product = data?.result;

    const handleDelete = () => {
        deleteProduct(productId, {
            onSuccess: (res) => {
                toast.success(res.msg);
                queryClient.invalidateQueries({
                    queryKey: ["allProducts"],
                });
                router.push("/products");
            },
            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    toast.error(err.response?.data.msg);
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push("/products")}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        ← Back to Products
                    </button>

                    {!editing && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* CONTENT CARD */}
                <div className="bg-white border rounded-2xl shadow-lg p-8">
                    {editing ? (
                        <UpdateProductForm productId={productId} form={product} />
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {product.title}
                            </h1>

                            <p className="text-gray-600 mb-6">
                                {product.description || "No description provided"}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">
                                    ₹{product.price}
                                </span>

                                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                                    {product.category}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;