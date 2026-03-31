"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateProduct } from "../hooks/useProductApi";
import toast from "react-hot-toast";
import axios from "axios";

export type ProductFormData = {
    title: string;
    description?: string;
    price: number;
    category: string
};

const CreateProductForm = () => {
    const router = useRouter();

    const { register, handleSubmit, watch, reset } = useForm<ProductFormData>();

    //   const images = watch("images");

    const { mutate: createProduct, error, isPending } = useCreateProduct();

    const onSubmit = async (data: ProductFormData) => {
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.description) {
            formData.append("description", data.description);
        }

        formData.append("price", String(data.price));
        formData.append("category", data.category);

        createProduct(formData, {
            onSuccess: (res) => {
                console.log(res)
                toast.success(res.msg);
                reset()
            },
            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    toast.error(err.response?.data.msg)
                }
            }
        })
        router.push("/products");
    };

    return (
        <div className="w-full bg-white shadow-md rounded-xl p-4">
            <h1 className="text-xl font-bold mb-4 text-center">
                Create Product
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                    type="text"
                    placeholder="Product name"
                    {...register("title", { required: true })}
                    className="w-full border px-3 py-2 rounded"
                />

                <textarea
                    placeholder="Product description"
                    {...register("description")}
                    className="w-full border px-3 py-2 rounded"
                />

                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Amount"
                        {...register("price", { required: true })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Category"
                        {...register("category", { required: true })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Images
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          className="w-full border px-3 py-2 rounded"
        />

        {images?.length > 0 && (
          <p className="text-sm text-gray-500">
            {images.length} file(s) selected
          </p>
        )} */}

                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;