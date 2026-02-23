"use client"

import React from "react";
import { useParams } from "next/navigation";
import ProductDetails from "@/features/product/components/ProductDetails";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  if (!id) return <div>Missing product id</div>;

  return (
    <div className="p-6">
      <ProductDetails id={id} />
    </div>
  );
}
