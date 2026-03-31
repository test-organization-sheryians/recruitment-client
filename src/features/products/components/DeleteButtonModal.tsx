import React, { MouseEvent } from "react";
import { useDeleteProduct, useGetProducts } from "../hooks/useProductApi";

type DeleteButtonModalProps = {
  showDeleteButtonModal: boolean;
  setShowDeleteButtonModal: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string;
};

const DeleteButtonModal = ({
  setShowDeleteButtonModal,
  showDeleteButtonModal,
  productId,
}: DeleteButtonModalProps) => {
  const { mutate, isPending } = useDeleteProduct();

  const handleDeleteProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    mutate(productId, {
      onSuccess: () => {
        setShowDeleteButtonModal(false);
      },
    });

    // setShowDeleteButtonModal(false);
  };

  return (
    <div
      className={`absolute top-0 left-0 h-screen w-full bg-black/90 items-center justify-center flex ${showDeleteButtonModal ? "flex" : "hidden"}`}
    >
      <div className="flex flex-col gap-5 px-8 py-4 rounded-2xl bg-white">
        <h1>Do you want do delete this product?</h1>
        <div className="flex justify-between">
          <button
            onClick={() => setShowDeleteButtonModal(false)}
            className="px-3 py-1 rounded-lg cursor-pointer bg-green-400 hover:bg-green-500 transition-all 1s"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProduct}
            className="px-3 py-1 rounded-lg cursor-pointer bg-red-400 hover:bg-red-500 transition-all 1s"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteButtonModal;
