"use client";
import { fetchProduct } from "../hooks/fetchproduct";
import { useRouter } from "next/navigation";

const FetchProducts = () => {  
  const { data, isLoading, error } = fetchProduct();
  const router = useRouter(); // ✅ ALWAYS TOP
  if(isLoading)return <p>loading...</p>
  return (
    <div className="flex flex-wrap gap-6 p-6">
     
      {data?.products.map((e: any) => (
        <div
          key={e._id}
          className="w-[250px] border rounded-xl p-4 shadow-md hover:shadow-lg transition"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">{e.title}</h1>

            <p className="text-sm text-gray-600 line-clamp-2">
              {e.description}
            </p>

            <p className="text-md font-bold text-green-600">
              ₹{e.price}
            </p>

            <button
              onClick={() => router.push(`/products/${e._id}`)}
              className="mt-2 bg-black text-white py-1 rounded-md hover:bg-gray-800"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchProducts;