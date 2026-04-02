"use client"
import { useForm } from "react-hook-form";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useQueryClient } from "@tanstack/react-query";

const EditProduct = ({ data, setEditToggle }: any) => {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdateProduct();
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: data.name,
      description: data.description,
      price: data.price,
    },
  });

  const onSubmit = (formdata: any) => {
    mutate(
      { id: data._id, data: formdata },
      {
        onSuccess: () => {
          setEditToggle(false);
          queryClient.invalidateQueries({ queryKey: ["products"] })
          queryClient.invalidateQueries({ queryKey: [`product:${data._id}`] })
        },
      }
    );
  };

  return (
    <div className="w-[50vw] mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
        <button 
          onClick={() => setEditToggle(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Product Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Wireless Headphones"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            {...register("name")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            {...register("description")}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="price">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            {...register("price")}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setEditToggle(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;