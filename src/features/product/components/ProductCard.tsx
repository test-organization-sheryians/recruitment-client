import Link from "next/link";
import { Prodcut } from "../domin/Prodcut";

interface Props {
  product: Prodcut;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function ProductCard({ product, onDelete }: Props) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.formattedPrice()}</p>
      <p>{product.isInStock() ? "In Stock" : "Out of Stock"}</p>
      <div className="flex gap-2 mt-3">
        <Link href={`/products/${product._id}`} className="btn">
          View
        </Link>
        <Link href={`/products/${product._id}`} className="btn">
          Edit
        </Link>
        {onDelete && (
          <button
            className="btn btn-danger"
            onClick={async () => {
              if (!confirm("Delete this product?")) return;
              try {
                await onDelete(product._id);
                alert("Deleted");
              } catch (e) {
                console.error(e);
                alert("Delete failed");
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}