"use client";
import { useFetchSingleProduct } from "../hooks/useFetchSingleProduct";

const ViewProduct = ({ id }: any) => {
  const { data, isLoading, error } = useFetchSingleProduct(id);
    if(isLoading)return <h1>loading...</h1>
    
  const handleEdit = () => {
   
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {data?.data.product?.name}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {data?.data.product?.seller}
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