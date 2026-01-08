import { useCreateProduct } from "../hooks/useCreateproducts";

export default function ProductForm() {
  const { mutate, isPending } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      price: Number(
        (form.elements.namedItem("price") as HTMLInputElement).value
      ),
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
    };

    mutate(data);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        name="name"
        placeholder="Product name"
        className="border p-2 w-full"
      />
      <input
        name="price"
        placeholder="Price"
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 w-full"
      />
      <button
        disabled={isPending}
        className="bg-black text-white px-4 py-2"
      >
        {isPending ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}



