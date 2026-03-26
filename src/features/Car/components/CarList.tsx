"use client";

import { useState } from "react";
import { useGetAllCar, useDeleteCar } from "../Hooks/useCars";
import CarForm from "./CarForm";
import { Car } from "@/types/car";

export default function CarList() {
  const { data, isLoading } = useGetAllCar();
  const { mutate: deleteCar, isPending } = useDeleteCar();

  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return <p className="p-4">Loading cars...</p>;
  }

  if (!data?.length) {
    return (
      <div className="p-6 text-center">
        <p className="mb-3">No Cars Found</p>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create First Car
        </button>

        {showCreate && (
          <Modal onClose={() => setShowCreate(false)}>
            <CarForm onSuccess={() => setShowCreate(false)} />
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Cars</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Car
        </button>
      </div>

      {/* Car List */}
      <div className="grid gap-4">
        {data.map((car: Car) => (
          <div
            key={car._id}
            className="border p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h2 className="font-semibold text-lg">{car.title}</h2>
              <p className="text-sm text-gray-500">
                {car.brand} • {car.year} • {car.kmDriven} km
              </p>
              <p className="text-sm text-gray-500">
                <span className="capitalize">{car.fuelType}</span> • <span className="capitalize">{car.transmission}</span>
              </p>
              <p className="font-bold text-lg mt-1">₹ {car.price.toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingCar(car)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Edit
              </button>

              <button
                disabled={isPending}
                onClick={() => deleteCar(car._id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <CarForm onSuccess={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingCar && (
        <Modal onClose={() => setEditingCar(null)}>
          <CarForm
            isEdit
            carId={editingCar._id}
            defaultValues={editingCar}
            onSuccess={() => setEditingCar(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-[500px] relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
