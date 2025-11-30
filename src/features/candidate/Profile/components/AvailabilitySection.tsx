"use client";
import { useState, useEffect } from "react";
import { useUpdateAvailability } from "../hooks/useProfileApi";

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

  const updateAvailabilityMutation = useUpdateAvailability();

  useEffect(() => {
    if (availability) {
      setSelectedAvailability(availability);
    }
  }, [availability]);

  const handleSave = () => {
    updateAvailabilityMutation.mutate(selectedAvailability, {
      onSuccess: () => {
        alert("Availability updated successfully");
        onUpdate?.();
      },
      onError: (error: Error) => {
        const apiError = error as ApiError;
        const message = apiError.response?.data?.message || error.message || "Failed to update availability";
        alert(message);
      },
    });
  };

  const handleChange = (value: string) => {
    const validOptions = AVAILABILITY_OPTIONS.map(opt => opt.value);
    if (validOptions.includes(value as AvailabilityOption)) {
      setSelectedAvailability(value as AvailabilityOption);
    }
  };

  return (
  <div className="bg-white rounded-2xl p-6  space-y-5">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">
        Availability
      </h2>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Current Status
        </label>
        <select
          value={selectedAvailability}
          onChange={(e) => handleChange(e.target.value)}
          disabled={updateAvailabilityMutation.isPending}
          aria-label="Select availability status"
          className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {AVAILABILITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={
            updateAvailabilityMutation.isPending ||
            selectedAvailability === availability
          }
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {updateAvailabilityMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

}