import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import { useUpdateProduct } from "../hooks/useProductApi";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export interface updateData { data: ProductFormData, id: string }

const UpdateProductForm = ({
    form,
    productId,
}: {
    form: any;
    productId: string;
}) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } =
        useForm<ProductFormData>();

    const { mutate: productUpdate, isPending } =
        useUpdateProduct();

    useEffect(() => {
        if (form) {
            reset({
                title: form.title,
                description: form.description,
                price: form.price,
                category: form.category,
            });
        }
    }, [form, reset]);

    const onSubmit = (data: ProductFormData) => {
        productUpdate(
            { data, id: productId },
            {
                onSuccess: (res) => {
                    toast.success(res.msg);

                    queryClient.invalidateQueries({
                        queryKey: ["allProducts"],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["product", productId],
                    });

                    router.push("/products");
                },
                onError: (err) => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err.response?.data.msg);
                    }
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-xl font-semibold mb-2">
                Update Product
            </h2>

            <div>
                <label className="text-sm font-medium">Title</label>
                <input
                    {...register("title", { required: true })}
                    className="mt-1 w-full border rounded-lg px-3 py-2
          focus:ring-2 focus:ring-black outline-none"
                />
            </div>

            <div>
                <label className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    rows={3}
                    {...register("description")}
                    className="mt-1 w-full border rounded-lg px-3 py-2
          focus:ring-2 focus:ring-black outline-none"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Price</label>
                <input
                    type="number"
                    {...register("price", { required: true })}
                    className="mt-1 w-full border rounded-lg px-3 py-2
          focus:ring-2 focus:ring-black outline-none"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Category</label>
                <input
                    {...register("category", { required: true })}
                    className="mt-1 w-full border rounded-lg px-3 py-2
          focus:ring-2 focus:ring-black outline-none"
                />
            </div>

            <button
                disabled={isPending}
                className="w-full bg-black text-white py-3 rounded-lg
        hover:bg-gray-800 transition disabled:opacity-50"
            >
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
};

export default UpdateProductForm;