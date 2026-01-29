'use client';

import { useState } from "react";
import { useCreateProduct } from "@/features/product/hooks/hook";

export default function CreateProductPage() {
  const { mutate, isPending, isSuccess } = useCreateProduct();

  const [form, setForm] = useState({
    name: "",
    prices: "",
    description: "",
    stock: 0,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(handleSubmit)
    mutate(form);
  };

  return (

   
    <form onSubmit={handleSubmit} className=" m-5 p-5">

      <div className="p-5 m-5 gap-5 felx items-center justify-between gap-5 ">
              <input name="name"
                className="p-5 font-bold text-black text-3xl  rounded-lg"
              placeholder="Name" onChange={handleChange} />
      <input name="prices"
        className="p-5 font-bold text-3xl  rounded-lg"
      placeholder="Price" onChange={handleChange} />
      <input name="description"
        className="p-5 font-bold text-3xl  rounded-lg"
      placeholder="Description" onChange={handleChange} />
      <input name="stock" 
        className="p-5 font-bold text-3xl   rounded-lg"
      type="number" placeholder="Stock" onChange={handleChange} />
      
      </div>

      <div>
          <button type="submit" disabled={isPending}
           className="p-2 font-bold bg-green-200 rounded-lg"
          >
        {isPending ? "Creating..." : "Create Product"}
      </button>
      </div>
    

      {isSuccess && <p>✅ Product created successfully</p>}
     
    </form>
  );
}





