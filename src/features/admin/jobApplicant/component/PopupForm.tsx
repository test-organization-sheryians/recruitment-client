"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useScheduleInterview } from "../hooks/useJobApplicant";
import { useToast } from "@/components/ui/Toast";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string | null; // This must be the User ID
  jobId: string;
}

export default function PopupForm({
  isOpen,
  onClose,
  candidateId,
  jobId,
}: PopupFormProps) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewerEmail: "",
    meetingLink: "",
  });

  const { mutate: scheduleInterview, isPending } = useScheduleInterview();
  const { success, error } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !jobId) {
      error("Missing candidate or job information");
      return;
    }

    // 1. Combine Date and Time
    const dateTimeString = `${formData.interviewDate}T${formData.interviewTime}`;
    const timing = new Date(dateTimeString).toISOString();

    // 2. Construct Payload (FIXED SYNTAX HERE)
    const payload = {
      candidateId: candidateId,
      jobId: jobId,
      interviewerEmail: formData.interviewerEmail,
      meetingLink: formData.meetingLink,
      timing: timing,
      status: "Scheduled" as const, // <--- Fixed line
    };

    // 3. Call API
    scheduleInterview(payload, {
      onSuccess: () => {
        success("Interview scheduled successfully!");
        onClose();
        // Reset form
        setFormData({
          interviewDate: "",
          interviewTime: "",
          interviewerEmail: "",
          meetingLink: "",
        });
      },
      onError: (err: Error) => {
        const msg = err.message || "Failed to schedule interview.";
        error(msg);
      },
    });
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
            Interviewer Email
          </label>
          <Input
            type="email"
            name="interviewerEmail"
            placeholder="interviewer@company.com"
            value={formData.interviewerEmail}
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
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}