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
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold mb-2">Availability</h2>

      <select
        value={selectedAvailability}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-2 w-full max-w-xs"
        disabled={updateAvailabilityMutation.isPending}
        aria-label="Select availability status"
      >
        {AVAILABILITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={updateAvailabilityMutation.isPending || selectedAvailability === availability}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {updateAvailabilityMutation.isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}