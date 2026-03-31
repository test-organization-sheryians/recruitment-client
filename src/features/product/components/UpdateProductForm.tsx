import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ProductFormData } from './ProductForm';
import { useUpdateProduct } from '../hooks/useProductApi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";

export interface updateData {
    data: ProductFormData,
    id: string
}

const UpdateProductForm = ({ form, productId }: { form: any, productId: string }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<ProductFormData>();

    const { mutate: productUpdate, error, isPending } = useUpdateProduct();

    useEffect(() => {
        if (form) {
            reset({
                title: form.title,
                description: form.description,
                price: form.price,
                category: form.category
            });
        }
    }, [form, reset]);

    const onSubmit = async (data: ProductFormData) => {
        productUpdate({ data, id: productId }, {
            onSuccess: (res) => {
                toast.success(res.msg);

                queryClient.invalidateQueries({ queryKey: ["allProducts"] });
                queryClient.invalidateQueries({ queryKey: ["product", productId] })
                router.push("/products");
                reset()
            },

            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    toast.error(err.response?.data.msg)
                }
            }
        })
    }


    return (
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

            <button
                disabled={isPending}
                type="submit"
                className="w-full bg-black text-white py-2 rounded"
            >
                Save
            </button>
        </form>
    )
}

export default UpdateProductForm