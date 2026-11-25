"use client";

export default function ProductCard({ product, onDelete }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex justify-between">
      <div>
        <h3 className="font-semibold text-gray-800">
          {product.name}
        </h3>

        <p className="text-blue-600 font-medium">
          ₹ {product.price}
        </p>
      </div>

      <button
        onClick={() => onDelete(product._id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}
