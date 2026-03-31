"use client";

import UpdateProductForm from "@/features/product/components/UpdateProductForm";
import { useDeleteProduct, useFetchProductById} from "@/features/product/hooks/useProductApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const ProductPage = () => {
    const queryClient = useQueryClient();
    const { productId } = useParams<{productId: string}>();
    const { data, isLoading } = useFetchProductById(productId as string);
    const {mutate: deleteProduct} = useDeleteProduct();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<any>({});

    const router = useRouter();

    if (isLoading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    const product = data?.result;

    const handleEdit = () => {
        setEditing(true);
        setForm(product);
    };

    const handleDelete = ()=>{
        deleteProduct(productId, {
            onSuccess: (res)=>{
                toast.success(res.msg);
                queryClient.invalidateQueries({queryKey: ["allProducts"]});

                router.push("/products")
            },

            onError:(err)=>{
                if(axios.isAxiosError(err)){
                    toast.error(err.response?.data.msg)
                }
            }
        })
    }


    return (
        <div className="min-h-screen w-full p-10">
            <div className="p-6 max-w-md mx-auto border rounded-xl shadow">
                {editing ? (
                   <UpdateProductForm productId={productId} form={form} />
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-3">{product.title}</h1>

                        <p className="text-gray-600 mb-3">
                            {product.description || "No description"}
                        </p>

                        <div className="font-bold mb-2">₹{product.price}</div>

                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {product.category}
                        </span>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductPage;