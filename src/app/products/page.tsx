"use client";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first (check browser console for token)");
      return;
    }

    try {
      const newProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock: parseInt(formData.stock),
      };

      const res = await fetch("http://localhost:9000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create");

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
      });
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert("Error creating product. Check token!");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category || "",
      stock: product.stock.toString(),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || !editingId) return;

    try {
      const updatedProduct = {
        name: editForm.name,
        price: parseFloat(editForm.price),
        description: editForm.description,
        category: editForm.category,
        stock: parseInt(editForm.stock),
      };

      const res = await fetch(
        `http://localhost:9000/api/products/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        },
      );

      if (!res.ok) throw new Error("Update failed");

      setEditingId(null);
      fetchProducts();
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }

    try {
      await fetch(`http://localhost:9000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Products ({products.length})
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            + Create Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg"
            >
              {editingId === product._id ? (
                // EDIT FORM
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2"
                    placeholder="Name"
                  />
                  <input
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2"
                    placeholder="Price"
                    type="number"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2"
                    rows={2}
                    placeholder="Description"
                  />
                  <input
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2"
                    placeholder="Category"
                  />
                  <input
                    value={editForm.stock}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stock: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2"
                    placeholder="Stock"
                    type="number"
                  />
                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // NORMAL CARD VIEW
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {product.category || "General"}
                    </span>
                    <span className="text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create Product</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
