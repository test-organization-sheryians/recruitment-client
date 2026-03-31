"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "../hooks/useProductApi";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export type ProductFormData = {
    title: string;
    description?: string;
    price: number;
    category: string;
};

const CreateProductForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } =
        useForm<ProductFormData>();

    const { mutate: createProduct, isPending } =
        useCreateProduct();

    const onSubmit = async (data: ProductFormData) => {
        const formData = new FormData();

        formData.append("title", data.title);
        if (data.description)
            formData.append("description", data.description);

        formData.append("price", String(data.price));
        formData.append("category", data.category);

        createProduct(formData, {
            onSuccess: (res) => {
                toast.success(res.msg);

                queryClient.invalidateQueries({ queryKey: ["allProducts"] })
                reset();
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
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border p-8">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Create Product
                </h1>
                <p className="text-sm text-gray-500">
                    Add a new product to your store
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        {...register("title", { required: true })}
                        placeholder="iPhone 15"
                        className="mt-1 w-full rounded-lg border px-3 py-2 outline-none
            focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        {...register("description")}
                        placeholder="Product details..."
                        className="mt-1 w-full rounded-lg border px-3 py-2 outline-none
            focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        {...register("price", { required: true })}
                        placeholder="999"
                        className="mt-1 w-full rounded-lg border px-3 py-2 outline-none
            focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        {...register("category", { required: true })}
                        placeholder="Electronics"
                        className="mt-1 w-full rounded-lg border px-3 py-2 outline-none
            focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-medium
          hover:bg-gray-800 transition disabled:opacity-50"
                >
                    {isPending ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;