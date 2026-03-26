import { useForm } from "react-hook-form";
import { useCreateCar, useUpdateCar } from "../Hooks/useCars";
import { CreateCarPayload, Car } from "@/types/car";

type CarFormProps = {
  onSuccess: () => void;
  isEdit?: boolean;
  carId?: string;
  defaultValues?: Partial<Car>;
};

export default function CarForm({
  onSuccess,
  isEdit,
  carId,
  defaultValues,
}: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCarPayload>({
    defaultValues: defaultValues as any,
  });

  const { mutate: createCar, isPending: isCreating } = useCreateCar();
  const { mutate: updateCar, isPending: isUpdating } = useUpdateCar();

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: CreateCarPayload) => {
    if (isEdit && carId) {
      updateCar(
        { carId, ...data },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    } else {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      createCar(formData, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Car" : "Create Car"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            placeholder="e.g. Honda Civic 2020"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              {...register("brand", { required: "Brand is required" })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="e.g. Honda"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              {...register("year", {
                required: "Year is required",
                valueAsNumber: true,
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="e.g. 2020"
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="1000000"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">KM Driven</label>
            <input
              type="number"
              {...register("kmDriven", {
                required: "KM driven is required",
                valueAsNumber: true,
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="15000"
            />
            {errors.kmDriven && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kmDriven.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fuel Type</label>
            <select
              {...register("fuelType", { required: "Fuel type is required" })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transmission</label>
            <select
              {...register("transmission", {
                required: "Transmission is required",
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}