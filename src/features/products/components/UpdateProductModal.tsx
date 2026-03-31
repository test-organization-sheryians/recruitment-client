import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProduct } from "../hooks/useProductApi";
import { toast } from "react-toastify";

type UpdateProductModalProps = {
  setShowUpdateProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUpdateProductModal: boolean;
  productId: string;
};

type UpdateProductFormData = {
  title: string;
  description: string;
  amount?: number;
  price: object;
};

const UpdateProductModal = ({
  setShowUpdateProductModal,
  showUpdateProductModal,
  productId,
}: UpdateProductModalProps) => {
  const { mutate, isPending } = useUpdateProduct();
  const { register, handleSubmit, reset } = useForm<UpdateProductFormData>();

  const handleUpdateProduct = (data: UpdateProductFormData) => {
    data.price = { amount: data.amount };
    delete data.amount;
    mutate(
      {
        productId,
        data,
      },
      {
        onSuccess: () => {
          setShowUpdateProductModal(false);
          toast.success("Product Updated Successfully");
          reset();
        },
      },
    );
  };

  return (
    <div>
      <div
        className={`absolute top-0 left-0 h-screen w-full bg-black/90 items-center justify-center flex-col flex ${showUpdateProductModal ? `flex` : `hidden`}  `}
      >
        <div
          onClick={() => setShowUpdateProductModal(false)}
          className="absolute p-5 top-5 hover:bg-white/20 rounded-full right-10 text-white font-bold text-2xl cursor-pointer"
        >
          X
        </div>
        <form method="post" onSubmit={handleSubmit(handleUpdateProduct)}>
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
            </div>
            <button className="px-4 py-1.5 flex items-center justify-center cursor-pointer bg-green-500 text-black rounded-lg hover:bg-green-600 transition-all 1s">
              {isPending ? "Updating..." : "Update details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
