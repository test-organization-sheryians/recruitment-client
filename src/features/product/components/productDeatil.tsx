import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <div className="border p-4 rounded">
      <h3>{product.name}</h3>
      <p>₹ {product.prices}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
};

export default ProductCard;
