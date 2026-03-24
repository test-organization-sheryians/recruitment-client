"use client";

import { useGetProducts } from "../hooks/useProductApi";
import Image from "next/image";

const AllProducts = () => {
  const { data, isLoading } = useGetProducts();
  console.log(data);
  return (
    <div className="p-5">
      <h1 className="font-bold text-4xl text-center">All Products</h1>
      <div className="flex flex-wrap">
        {isLoading ? (
          <div>
            <h1 className="text-2xl">Loading...</h1>
          </div>
        ) : (
          data?.map((elem) => {
            return (
              <div
                key={String(elem.id)}
                className="border m-5 p-5 hover:bg-fuchsia-50 cursor-pointer w-90 flex flex-col gap-5"
              >
                <h3 className="text-fuchsia-800">{elem.title}</h3>
                <Image
                  src={elem.image}
                  alt={elem.title}
                  width={150}
                  height={150}
                />
                <p>{elem.description}</p>
                <strong>{elem.price}</strong>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllProducts;
