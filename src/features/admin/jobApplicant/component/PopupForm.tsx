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
  // optional callback invoked after successful schedule/reschedule
  // may return a Promise if parent performs async navigation
  onSuccess?: () => Promise<void> | void;
  candidateId: string | null;
  jobId: string;
  applicationId: string;
  mode: "schedule" | "reschedule";
  interviewId?: string | null;
}

export default function PopupForm({
  isOpen,
  onClose,
  onSuccess,
  candidateId,
  jobId,
  applicationId,
  mode,
  interviewId,
}: PopupFormProps) {
  const today = new Date().toISOString().split('T')[0];

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
          // keep status as Scheduled on backend; add isRescheduled for UI
          status: "Scheduled",
          isRescheduled: true,
        });

        success("Interview rescheduled successfully");
        // notify parent that scheduling succeeded (parent will close modal then navigate)
        if (typeof onSuccess === "function") {
          try {
            const res = onSuccess();
            if (res && typeof (res as any).catch === "function") {
              // avoid unhandled promise rejection
              (res as Promise<void>).catch((e) => console.error("onSuccess callback failed", e));
            }
          } catch (e) {
            console.error("onSuccess callback failed", e);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          error(err.message);
        } else {
          error("Failed to reschedule interview");
        }
      }


      return;
    }

    // Schedule interview only creates an interview record.
    // Status change (selecting for interview) is a separate action handled elsewhere.
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
          success("Interview scheduled successfully");
          if (typeof onSuccess === "function") {
            try {
              const res = onSuccess();
              if (res && typeof (res as any).catch === "function") {
                (res as Promise<void>).catch((e) => console.error("onSuccess callback failed", e));
              }
            } catch (e) {
              console.error("onSuccess callback failed", e);
            }
          }
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
          <Input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} min={today} required />
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