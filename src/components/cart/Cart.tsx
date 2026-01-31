"use client";

import { useEffect, useState } from "react";
import { getCart, addCartItem as addToCart }from "../../features/cart/Services/cart.api";

import { CartItem } from "@/types/cart.type";

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data.items ?? data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async () => {
    await addToCart({ product: "React Course", quantity: 1 });
    loadCart();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Cart</h1>

      {cart.map((item) => (
        <div key={item._id} className="flex justify-between border p-2">
          <span>{item.product}</span>
          <span>{item.quantity}</span>
        </div>
      ))}

      <button
        className="bg-black text-white px-4 py-2"
        onClick={addItem}
      >
        Add Item
      </button>
    </div>
  );
}
