"use client";
import { useState, useEffect } from "react";
import { useUpdateAvailability } from "../hooks/useProfileApi";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

type AvailabilityOption = "immediate" | "1_week" | "2_weeks" | "1_month" | "not_looking";

interface Props {
  availability?: AvailabilityOption;
  onUpdate?: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
  { value: "immediate", label: "Immediate" },
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "1_month", label: "1 Month" },
  { value: "not_looking", label: "Not Looking" },
];

export default function AvailabilitySection({ availability, onUpdate }: Props) {
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityOption>(
    availability ?? "not_looking"
  );
  const [isOpen, setIsOpen] = useState(false);

  const updateAvailabilityMutation = useUpdateAvailability();

  useEffect(() => {
    if (availability) {
      setSelectedAvailability(availability);
    }
  }, [availability]);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSave = () => {
    updateAvailabilityMutation.mutate(selectedAvailability, {
      onSuccess: () => {
        setIsOpen(false);
        onUpdate?.();
      },
      onError: (error: Error) => {
        const apiError = error as ApiError;
        const message =
          apiError.response?.data?.message ||
          error.message ||
          "Failed to update availability";
        alert(message);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Availability
        </h2>

        <button className="text-white bg-blue-600 px-4 py-2 rounded-lg text-md" onClick={toggleModal}>
          Edit
        </button>
      </div>

      {/* Display current status */}
      <div className="text-sm text-gray-700">
        {AVAILABILITY_OPTIONS.find(opt => opt.value === availability)?.label || "Not set"}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Update Availability">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Status
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) =>
                setSelectedAvailability(e.target.value as AvailabilityOption)
              }
              disabled={updateAvailabilityMutation.isPending}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black/60 transition"
            >
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={
              updateAvailabilityMutation.isPending ||
              selectedAvailability === availability
            }
            className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
          >
            {updateAvailabilityMutation.isPending ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
