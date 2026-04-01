"use client";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const DeleteProduct = ({
  id,
  setDeleteToggle,
}: {
  id: string;
  setDeleteToggle: any;
}) => {
  // ✅ Hook hamesha yahan (Component ke andar) hona chahiye
  const { mutate, isPending } = useDeleteProduct(id);
  const querClient = useQueryClient();
  const router = useRouter();
  const handleDelete = () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          alert("Product deleted successfully!");
          setDeleteToggle(false);
          // Agar aap Next.js use kar rahe hain, toh yahan router.push('/') kar sakte hain
          querClient.invalidateQueries({ queryKey: ["products"] });
          router.push("/products");
        },
        onError: (err) => {
          console.error("Delete failed:", err);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
        <p className="text-gray-500 mb-6">Product ID: {id}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setDeleteToggle(false)}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
