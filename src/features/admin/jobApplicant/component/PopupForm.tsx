"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateInterview, useBulkUpdateApplicants } from "../hooks/useJobApplicant";
import { useToast } from "@/components/ui/Toast";
import api from "@/config/axios";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string | null;
  jobId: string;
  applicationId: string;
  mode: "schedule" | "reschedule";
  interviewId?: string | null;
}

export default function PopupForm({
  isOpen,
  onClose,
  candidateId,
  jobId,
  applicationId,
  mode,
  interviewId,
}: PopupFormProps) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewerEmail: "",
    meetingLink: "",
  });

  const { mutate: updateApplicantStatus } = useBulkUpdateApplicants();
  const { mutate: scheduleInterview, isPending } = useCreateInterview();
  const { success, error } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        interviewDate: "",
        interviewTime: "",
        interviewerEmail: "",
        meetingLink: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateId || !jobId) {
      error("Missing candidate or job information");
      return;
    }

    const timing = new Date(
      `${formData.interviewDate}T${formData.interviewTime}`
    ).toISOString();

    if (mode === "reschedule") {
      if (!interviewId) {
        error("Interview ID missing");
        return;
      }

      try {
        await api.patch(`/api/interviews/${interviewId}/reschedule`, {
          interviewerEmail: formData.interviewerEmail,
          meetingLink: formData.meetingLink,
          timing,
          status: "Rescheduled",
        });

        success("Interview rescheduled successfully");
        onClose();
      } catch (err: any) {
        error(err.message || "Failed to reschedule interview");
      }

      return;
    }

    scheduleInterview(
      {
        candidateId,
        jobId,
        interviewerEmail: formData.interviewerEmail,
        meetingLink: formData.meetingLink,
        timing,
        status: "Scheduled",
      },
      {
        onSuccess: () => {
          updateApplicantStatus(
            {
              applicationIds: [applicationId],
              status: "interview",
            },
            {
              onSuccess: () => {
                success("Interview scheduled successfully");
                onClose();
              },
              onError: () => {
                error("Interview scheduled but status update failed");
              },
            }
          );
        },
        onError: (err: Error) => {
          error(err.message || "Failed to schedule interview");
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "reschedule" ? "Reschedule Interview" : "Schedule Interview"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} required />
          <Input type="time" name="interviewTime" value={formData.interviewTime} onChange={handleChange} required />
        </div>

        <Input
          type="email"
          name="interviewerEmail"
          value={formData.interviewerEmail}
          onChange={handleChange}
          required
          placeholder="Enter Interviewer's Email"
        />

        <Input
          type="url"
          name="meetingLink"
          value={formData.meetingLink}
          onChange={handleChange}
          required
          placeholder="Enter Meeting Link"
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {mode === "reschedule"
              ? "Reschedule Interview"
              : isPending
              ? "Scheduling..."
              : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
