"use client";
import { useState } from "react";
import { useFetchSingleProduct } from "../hooks/useFetchSingleProduct";
import DeleteProduct from "./deleteProduct";
import EditProduct from "./editProduct";
import { useRouter } from "next/navigation";

const ViewProduct = ({ id }: any) => {
  const router = useRouter()
  const [editToggle, setEditToggle] = useState(false)
  const [deleteToggle, setDeleteToggle] = useState(false)
  const { data, isLoading, error } = useFetchSingleProduct(id);
    if(isLoading)return <h1>loading...</h1>
 
  const handleEdit = () => {
    setEditToggle((prev)=>!prev)
  };

  const handleDelete = () => {
    setDeleteToggle(true);
  };
console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      {editToggle && <div className="absolute left-1/2 -translate-x-1/2 bg-white"><EditProduct data={data?.data.product} setEditToggle={setEditToggle} /></div>}
       {deleteToggle && <div className="absolute left-1/2 -translate-x-1/2 "><DeleteProduct id={id} setDeleteToggle={setDeleteToggle} /></div>}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={()=>router.push("/products")}
          className="mb-5 text-gray-400 hover:text-black hover:border-black border rounded px-4 py-1 active:scale-90">Go back</button>
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {data?.data.product?.name}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {data?.data.product?.description}
        </p>

        {/* Price */}
        <p className="text-xl font-semibold text-green-600 mb-6">
          ₹{data?.data.product?.price}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;