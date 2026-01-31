"use client";

import { useEffect, useState } from "react";
import { getCart, addCartItem } from "../Services/cart.api";
import { CartItem } from "@/types/cart.type";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const data: CartItem[] = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: string, quantity: number) => {
    await addCartItem({ product, quantity });
    fetchCartItems();
  };

  const updateItem = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const searchById = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id === id));
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    searchById,
    fetchCartItems,
  };
};
