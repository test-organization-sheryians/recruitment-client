import React from "react";

type HeaderProps = {
  setShowCreateProductModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ setShowCreateProductModal }: HeaderProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">All Products</h3>
        <button
          onClick={() => setShowCreateProductModal(true)}
          className="px-4 py-1.5 flex items-center justify-center cursor-pointer bg-green-500 text-black rounded-lg hover:bg-green-600 transition-all 1s"
        >
          Create a product
        </button>
      </div>
    </div>
  );
};

export default Header;
