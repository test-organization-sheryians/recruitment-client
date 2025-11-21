"use client";
import { useState } from "react";
import { useUpdateAvailability } from "../hooks/useProfileApi";

type AvailabilityOption = "immediate" | "1_week" | "2_weeks" | "1_month" | "not_looking";

interface Props {
  availability?: AvailabilityOption;
  onUpdate?: () => void; // optional callback to refetch profile
}

const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  "immediate",
  "1_week",
  "2_weeks",
  "1_month",
  "not_looking",
];

export default function AvailabilitySection({ availability, onUpdate }: Props) {
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityOption>(
    availability ?? "not_looking"
  );

  const updateAvailabilityMutation = useUpdateAvailability();

  const handleSave = () => {
    updateAvailabilityMutation.mutate(selectedAvailability, {
      onSuccess: () => {
        alert("Availability updated successfully");
        onUpdate?.(); // refetch profile if needed
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Failed to update availability");
      },
    });
  };

  const handleChange = (value: string) => {
    if (AVAILABILITY_OPTIONS.includes(value as AvailabilityOption)) {
      setSelectedAvailability(value as AvailabilityOption);
    }
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold mb-2">Availability</h2>

      <select
        value={selectedAvailability}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-1 w-full max-w-xs"
      >
        {AVAILABILITY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option === "immediate"
              ? "Immediate"
              : option === "1_week"
              ? "1 Week"
              : option === "2_weeks"
              ? "2 Weeks"
              : option === "1_month"
              ? "1 Month"
              : "Not Looking"}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
