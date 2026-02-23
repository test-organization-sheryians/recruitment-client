"use client"

import React from "react";
import { useProduct } from "../hooks/useProduct";
import { ProdcutService } from "../services/product.service";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function ProductDetails({ id }: Props) {
  const { product, loading, error } = useProduct(id);
  const service = new ProdcutService();
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });

  React.useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    }
  }, [product]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-4 border rounded shadow">
      {editing ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await service.updateProduct(product._id, {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category,
              });
              alert("Updated");
              setEditing(false);
            } catch (err) {
              console.error(err);
              alert("Update failed");
            }
          }}
        >
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="number" value={String(form.price)} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input type="number" value={String(form.stock)} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="btn">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2">{product.description}</p>
          <p className="mt-2">Price: {product.formattedPrice()}</p>
          <p className="mt-2">{product.isInStock() ? "In Stock" : "Out of Stock"}</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditing(true)} className="btn">Edit</button>
            <button
              onClick={async () => {
                if (!confirm("Delete this product?")) return;
                try {
                  await service.deleteProduct(product._id);
                  alert("Deleted");
                  router.push("/products");
                } catch (err) {
                  console.error(err);
                  alert("Delete failed");
                }
              }}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
