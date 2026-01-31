"use client";

import { useState } from "react";
import { useCart } from "../hooks/useCart";

export default function CartView() {
  const { cart, addItem } = useCart();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <h2 style={styles.title}>🛒 Cart Management</h2>

        {/* ADD PRODUCT */}
        <div style={styles.card}>
          <h4 style={styles.subTitle}>Add Product</h4>

          <input
            style={styles.input}
            placeholder="Product name"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button
            style={styles.btn}
            onClick={() => {
              if (!product.trim()) return;
              addItem(product, quantity);
              setProduct("");
              setQuantity(1);
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* CART ITEMS */}
        <div style={styles.listSection}>
          <h4 style={styles.subTitle}>Cart Items</h4>

          {cart.length === 0 ? (
            <p style={styles.empty}>No items in cart</p>
          ) : (
            <div style={styles.grid}>
              {cart.map((item) => (
                <div key={item._id} style={styles.itemCard}>
                  <strong>{item.product}</strong>
                  <p style={styles.qty}>Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
 
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  /* MAIN CONTAINER */
  container: {
    width: "100%",
    maxWidth: 760,
    background: "#0b1220",
    borderRadius: 18,
    padding: 36,
    boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
    border: "1px solid #1e293b",
  },

  title: {
    textAlign: "center",
    marginBottom: 28,
    fontSize: 26,
    fontWeight: 600,
    color: "#e5e7eb",
  },

  subTitle: {
    marginBottom: 14,
    fontSize: 15,
    fontWeight: 600,
    color: "#cbd5f5",
  },

  /* ADD PRODUCT CARD */
  card: {
    background: "#020617",
    borderRadius: 14,
    padding: 22,
    marginBottom: 36,
    border: "1px solid #1e293b",
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: 14,
    outline: "none",
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
  },

  /* CART LIST */
  listSection: {
    marginTop: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 18,
    marginTop: 14,
  },

  itemCard: {
    background: "#020617",
    borderRadius: 12,
    padding: 18,
    border: "1px solid #1e293b",
    color: "#e5e7eb",
  },

  qty: {
    marginTop: 6,
    fontSize: 14,
    color: "#94a3b8",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: 24,
  },
};
