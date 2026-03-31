"use client";
import React from "react";

const ViewProduct = ({ id }: any) => {
 console.log(id);
 
  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {id?.title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {id?.description}
        </p>

        {/* Price */}
        <p className="text-xl font-semibold text-green-600 mb-6">
          ₹{id?.price}
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