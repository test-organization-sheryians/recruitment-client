"use client";

import { useState } from "react";
import {
    useGetAllProducts,
    useGetProduct,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from "../hooks/useProducts";

import ProductForm from "./productForm";
import ProductList from "./productlist";

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    quantity: number;
}

export default function Product() {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProductId, setViewingProductId] = useState<string | null>(null);
    const { data, isLoading } = useGetAllProducts();
    const { data: singleProduct, isLoading: isLoadingSingle } = useGetProduct(viewingProductId);
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();

    const handleEdit = (id: string) => {
        const product = data?.find((p) => p._id === id);
        if (product) {
            setEditingProduct(product);
        }
    };

    const handleView = (id: string) => {
        setViewingProductId(id);
    };

    const handleCloseView = () => {
        setViewingProductId(null);
    };

    const handleFormSubmit = (formData: {
        name: string;
        price: number;
        description?: string;
        quantity: number;
    }) => {
        if (editingProduct) {
            updateProduct({ id: editingProduct._id, ...formData });
            setEditingProduct(null);
        } else {
            createProduct(formData);
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                    {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <ProductForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={isCreating || isUpdating}
                    initialValues={editingProduct || undefined}
                    submitText={editingProduct ? "Update Product" : "Add Product"}
                    onCancel={editingProduct ? handleCancelEdit : undefined}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                    All Products
                </h2>

                <ProductList
                    products={data || []}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={deleteProduct}
                    onView={handleView}
                />
            </div>

            {viewingProductId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Product Details</h3>
                        {isLoadingSingle ? (
                            <p>Loading...</p>
                        ) : singleProduct ? (
                            <div>
                                <p><strong>Name:</strong> {singleProduct.name}</p>
                                <p><strong>Price:</strong> ₹{singleProduct.price}</p>
                                <p><strong>Quantity:</strong> {singleProduct.quantity}</p>
                                {singleProduct.description && (
                                    <p><strong>Description:</strong> {singleProduct.description}</p>
                                )}
                            </div>
                        ) : (
                            <p>Product not found.</p>
                        )}
                        <button
                            onClick={handleCloseView}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
