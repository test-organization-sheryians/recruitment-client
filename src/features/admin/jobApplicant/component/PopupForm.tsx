"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string | null;
}

export default function PopupForm({
  isOpen,
  onClose,
  applicantId,
}: PopupFormProps) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewerName: "",
    meetingLink: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    console.log("Scheduling interview for applicant:", applicantId);
    console.log("Form Data:", formData);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Reset form or show success toast here
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <Input
              type="time"
              name="interviewTime"
              value={formData.interviewTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Interviewer Name
          </label>
          <Input
            type="text"
            name="interviewerName"
            placeholder="e.g. John Doe"
            value={formData.interviewerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Meeting Link
          </label>
          <Input
            type="url"
            name="meetingLink"
            placeholder="https://meet.google.com/..."
            value={formData.meetingLink}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}