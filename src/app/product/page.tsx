"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Open Edit Modal
  const handleEdit = (product: Product) => {
    setIsEdit(true);
    setSelectedId(product._id);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
    });
    setShowModal(true);
  };

  // Input change
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit (Create + Update)
  const handleSubmit = async () => {
    try {
      if (isEdit && selectedId) {
        // UPDATE
        await updateProduct(selectedId, {
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
        });
      } else {
        // CREATE
        await createProduct({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
        });
      }

      // Reset
      setShowModal(false);
      setIsEdit(false);
      setSelectedId(null);
      setFormData({ name: "", price: "", category: "" });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Product Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your products efficiently
        </p>
      </div>

      <button
        onClick={() => {
          setShowModal(true);
          setIsEdit(false);
        }}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
      >
        + Add Product
      </button>
    </div>

    {/* Products */}
    {products.length === 0 ? (
      <p className="text-center text-gray-500 mt-10">
        No products available
      </p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h2>

              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>

            <p className="text-2xl font-bold text-gray-900 mt-4">
              ₹{product.price}
            </p>

            {/* Actions */}
            <div className="flex justify-between mt-5">
              <button
                onClick={() => handleEdit(product)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}