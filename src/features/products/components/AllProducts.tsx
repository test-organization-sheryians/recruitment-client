"use client";

import { useGetProducts } from "../hooks/useProductApi";
import Image from "next/image";

type AllProductsProps = {
  setShowDeleteButtonModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
  setShowUpdateProductModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllProducts = ({
  setShowDeleteButtonModal,
  setShowUpdateProductModal,
  setProductId,
}: AllProductsProps) => {
  const { data, isLoading } = useGetProducts();

  return (
    <div className="">
      <div className="flex flex-wrap">
        {isLoading ? (
          <div>
            <h1 className="text-2xl">Loading...</h1>
          </div>
        ) : (
          data?.map((elem, idx) => {
            return (
              <div
                key={String(idx)}
                className="justify-between border rounded-lg m-5 p-5 w-90 flex flex-col gap-5"
              >
                <div>
                  <h3 className="font-semibold">{elem.title}</h3>
                  {/* <Image
                  src={elem.image}
                  alt={elem.title}
                  width={150}
                  height={150}
                /> */}
                  <p>{elem.description}</p>
                  <strong>
                    {typeof elem.price === "object"
                      ? elem.price?.amount
                      : elem.price}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setShowUpdateProductModal(true);
                      setProductId(elem._id);
                    }}
                    className="px-3 py-1 rounded-lg cursor-pointer bg-orange-400 hover:bg-orange-500 transition-all 1s"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteButtonModal(true);
                      setProductId(elem._id);
                    }}
                    className="px-3 py-1 rounded-lg cursor-pointer bg-red-400 hover:bg-red-500 transition-all 1s"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllProducts;
