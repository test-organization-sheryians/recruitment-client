"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateInterview } from "../hooks/useJobApplicant";
import { useToast } from "@/components/ui/Toast";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string | null;
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

  const { mutate: scheduleInterview, isPending } = useCreateInterview();
  const { success, error } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedCandidateId =
      typeof candidateId === "string" && candidateId.trim().length > 0
        ? candidateId
        : null;

    if (!normalizedCandidateId || !jobId) {
      error("Missing candidate or job information");
      return;
    }

    const timing = new Date(
      `${formData.interviewDate}T${formData.interviewTime}`
    ).toISOString();

    const payload = {
      candidateId: normalizedCandidateId,
      jobId,
      interviewerEmail: formData.interviewerEmail,
      meetingLink: formData.meetingLink,
      timing,
      status: "Scheduled" as const,
    };

    scheduleInterview(payload, {
      onSuccess: () => {
        success("Interview scheduled successfully!");
        onClose();
        setFormData({
          interviewDate: "",
          interviewTime: "",
          interviewerEmail: "",
          meetingLink: "",
        });
      },
      onError: (err: Error) => {
        error(err.message || "Failed to schedule interview");
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
