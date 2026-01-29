type ProductProps = {
  _id: string;
  name: string;
  prices: string;
  stock: number;
};

const ProductCard = ({ _id, name, prices, stock }: ProductProps) => {
  return ( 
    <div className="border rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-gray-600">₹ {prices}</p>
      <p className="text-xs text-gray-500">
        Stock: {stock}
      </p>

      <a
        href={`/products/${_id}`}
        className="text-blue-600 text-sm mt-2 inline-block"
      >
        View Details →
      </a>
    </div>
  );
};

export default ProductCard;
