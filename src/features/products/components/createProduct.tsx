"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

// Interface for Form Fields
interface IFormInput {
  name: string;
  description: string;
  price: number;
}

const CreateProduct = () => {
 const querClient = useQueryClient()
  const { mutate, isPending } = useCreateProduct();
const router = useRouter()
  // React Hook Form with TypeScript
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  // Type-safe submit handler
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data, {
      onSuccess: () => {
        querClient.invalidateQueries({ queryKey:["products"]})
        alert("Product Created!");
        reset(); // Form clear karein
        router.push("/products")

      },
      onError: (error: any) => {
        console.error("Mutation Error:", error);
        alert("Failed to create product");
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white border rounded-2xl shadow-sm mt-10">
      <button
          onClick={()=>router.push("/products")}
          className="mb-5 text-gray-400 hover:text-black hover:border-black border rounded px-4 py-1 active:scale-90">Go back</button>
      <h2 className="text-2xl font-semibold mb-6">Create New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Product Name</label>
          <input
            {...register("name", { 
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" }
            })}
            className={`p-2 border rounded-md outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            className="p-2 border border-gray-300 rounded-md h-28 resize-none"
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Price (INR)</label>
          <input
            type="number"
            {...register("price", { 
                required: "Price is required", 
                min: { value: 1, message: "Price must be greater than 0" },
                valueAsNumber: true 
            })}
            className="p-2 border border-gray-300 rounded-md"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {isPending ? "Processing..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;