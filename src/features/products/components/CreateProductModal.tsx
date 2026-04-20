"use client";

import React, { MouseEvent, useState } from "react";
import { useCreateProduct } from "../hooks/useProductApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CreateProductModalProps = {
  showCreateProductModal: boolean;
  setShowCreateProductModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type CreateProductFormData = {
  title: string;
  description: string;
  amount: number;
};

const CreateProductModal = ({
  showCreateProductModal,
  setShowCreateProductModal,
}: CreateProductModalProps) => {
  const { mutate, isPending } = useCreateProduct();
  const { register, handleSubmit, reset } = useForm<CreateProductFormData>();

  const handleCreateProduct = (data: CreateProductFormData) => {
    mutate(
      {
        title: data.title,
        description: data.description,
        price: {
          amount: data.amount,
        },
      },
      {
        onSuccess: () => {
          setShowCreateProductModal(false);
          toast.success("Product Updated Successfully");
          reset();
        },
      },
    );
  };

  return (
    <div
      className={`absolute top-0 left-0 h-screen w-full bg-black/90 items-center justify-center flex-col ${showCreateProductModal ? `flex` : `hidden`} `}
    >
      <div
        onClick={() => setShowCreateProductModal(false)}
        className="absolute p-5 top-5 hover:bg-white/20 rounded-full right-10 text-white font-bold text-2xl cursor-pointer"
      >
        X
      </div>
      <form onSubmit={handleSubmit(handleCreateProduct)}>
        <div className="flex flex-col gap-5 bg-white/80 p-5 text-black rounded-xl w-100">
          <input
            {...register("title")}
            className="border border-black rounded  px-3 py-1 placeholder:text-gray-600 outline-none "
            type="text"
            placeholder="Product Name"
          />
          <textarea
            {...register("description")}
            className="border border-black rounded  px-3 py-1 placeholder:text-gray-600 outline-none "
            placeholder="Description"
          />
          <div>
            <input
              {...register("amount")}
              className="border border-black rounded  px-3 py-1 placeholder:text-gray-600 outline-none "
              type="number"
              placeholder="Price"
            />
            <select className="border border-black rounded  px-3 py-1 outline-none">
              <option
                className="border border-black rounded  px-3 py-1 outline-none"
                value="INR"
              >
                INR
              </option>
              <option
                className="border border-black rounded  px-3 py-1 outline-none"
                value="USD"
              >
                USD
              </option>
            </select>
          </div>
          <button className="px-4 py-1.5 flex items-center justify-center cursor-pointer bg-green-500 text-black rounded-lg hover:bg-green-600 transition-all 1s">
            {isPending ? "Creating..." : "Create a product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductModal;
