import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="flex items-center justify-center h-52 bg-gray-50 p-4">
        <Image
          src={product.image}
          alt={product.title}
          width={120}
          height={120}
          className="object-contain h-full w-auto"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-500">
          {product.category}
        </span>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-yellow-500 font-medium">
            ⭐ {product.rating.rate}{" "}
            <span className="text-gray-400">({product.rating.count})</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;