"use client";

import React, { useState, useEffect } from "react";
import { useDeleteProducts } from "./hooks/useDeleteProduct";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate: deleteMutate, isPending } = useDeleteProducts();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isConfirming) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isConfirming]);

  const handleDelete = () => {
    deleteMutate(id, {
      onSuccess: () => {
        setIsConfirming(false);
      },
    });
  };

  return (
    <>
      {/* The Trigger Button */}
      <button
        onClick={() => setIsConfirming(true)}
        className="mt-4 block text-center bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-lg text-xs hover:bg-red-600 hover:text-white transition font-bold"
      >
        Delete
      </button>

      {/* The Full Page Overlay Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isPending && setIsConfirming(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 fade-in duration-300">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                You are about to delete{" "}
                <span className="font-bold text-slate-800">
                  "{productName}"
                </span>
                . This action is permanent and cannot be undone in the clinical
                registry.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Destruction"
                  )}
                </button>

                <button
                  onClick={() => setIsConfirming(false)}
                  disabled={isPending}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
                >
                  Cancel, Keep Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
