"use client";

import AllProducts from "@/features/products/components/AllProducts";
import CreateProductModal from "@/features/products/components/CreateProductModal";
import DeleteButtonModal from "@/features/products/components/DeleteButtonModal";
import Header from "@/features/products/components/Header";
import UpdateProductModal from "@/features/products/components/UpdateProductModal";
import { useState } from "react";

const page = () => {
  const [showCreateProductModal, setShowCreateProductModal] =
    useState<boolean>(false);

  const [showDeleteButtonModal, setShowDeleteButtonModal] =
    useState<boolean>(false);

  const [showUpdateProductModal, setShowUpdateProductModal] =
    useState<boolean>(false);

  const [productId, setProductId] = useState<string>("");
  return (
    <>
      <Header setShowCreateProductModal={setShowCreateProductModal} />
      <CreateProductModal
        setShowCreateProductModal={setShowCreateProductModal}
        showCreateProductModal={showCreateProductModal}
      />
      <UpdateProductModal
        showUpdateProductModal={showUpdateProductModal}
        setShowUpdateProductModal={setShowUpdateProductModal}
        productId={productId}
      />
      <DeleteButtonModal
        setShowDeleteButtonModal={setShowDeleteButtonModal}
        showDeleteButtonModal={showDeleteButtonModal}
        productId={productId}
      />
      <AllProducts
        setProductId={setProductId}
        setShowDeleteButtonModal={setShowDeleteButtonModal}
        setShowUpdateProductModal={setShowUpdateProductModal}
      />
    </>
  );
};

export default page;
