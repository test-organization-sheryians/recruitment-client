// components/ui/Toast.tsx
"use client";

import toast, { ToastOptions } from "react-hot-toast";

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    background: "#FFFFFF",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "15px",
    boxShadow: "0 10px 30px -8px rgba(0, 0, 0, 0.15)",
  },
};

export const useToast = () => {
  return {
    success: (message: string) =>
      toast.success(message, {
        ...defaultOptions,
        icon: "✅",
        style: { ...defaultOptions.style, background: "#FFFFFF" , color:"black" },
      }),

    error: (message: string) =>
      toast.error(message, {
        ...defaultOptions,
        icon: "❌",
        style: { ...defaultOptions.style, background: "#FFFFFF", color:"red" },
      }),

    loading: (message: string) =>
      toast.loading(message, {
        ...defaultOptions,
        icon: "⏳",
      }),

    promise: <T>(
      promise: Promise<T>,
      msgs: { loading: string; success: string; error: string }
    ) => {
      return toast.promise(promise, msgs, {
        ...defaultOptions,
        loading: { ...defaultOptions, icon: "⏳" },
        success: {
          ...defaultOptions,
          icon: "✅",
          style: { ...defaultOptions.style, background: "#FFFFFF" },
        },
        error: {
          ...defaultOptions,
          icon: "❌",
          style: { ...defaultOptions.style, background: "#EF4444" },
        },
      });
    },

    dismiss: toast.dismiss,
  };
};

