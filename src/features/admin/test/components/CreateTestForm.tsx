"use client";

import React, { useEffect, useState } from "react";
import { useCreateTest, useGetTest, useUpdateTest } from "../hooks/useTest";
import { useToast } from "@/components/ui/Toast";
import {  BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestFormValues } from "@/types/Test";

/* ---------- UI FORM TYPE ---------- */
interface FormData {
  title: string;
  summary: string;
  category: string;
  duration: string;
  passingScore: string;
  aiPrompt: string;
}

export default function CreateTestModal({
  open,
  onClose,
  testId,
}: {
  open: boolean;
  onClose: () => void;
  testId?: string;
}) {
  const { success, error } = useToast();

  const { data } = useGetTest(testId ?? "");
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    summary: "",
    category: "",
    duration: "",
    passingScore: "",
    aiPrompt: "",
  });

  /* ---------- PREFILL ---------- */
  useEffect(() => {
    if (!data) return;

    setFormData({
      title: data.title ?? "",
      summary: data.summury ?? "",
      category: data.category ?? "",
      duration: String(data.duration ?? ""),
      passingScore: String(data.passingScore ?? ""),
      aiPrompt: data.prompt ?? "",
    });
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TestFormValues = {
      title: formData.title,
      summury: formData.summary,
      description: formData.summary,
      category: formData.category,
      duration: Number(formData.duration),
      passingScore: Number(formData.passingScore),
      prompt: formData.aiPrompt,
      showResults: true,
    };

    try {
      if (testId) {
        await updateTest.mutateAsync({ id: testId, data: payload });
        success("Test updated successfully");
      } else {
        await createTest.mutateAsync(payload);
        success("Test created successfully");
      }
      onClose();
    } catch {
      error("Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <div className="w-full max-w-6xl rounded-2xl bg-[#f8fcff] from-sky-50 to-white p-6 relative shadow-xl">
         

          {/* ---------- HEADER ---------- */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <BookOpen className="text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {testId ? "Update Assessment" : "Create New Assessment"}
                </h1>
                <p className="text-sm text-gray-500">
                  Configure assessment details
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              
              <Button
                form="test-form"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save & Generate
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>

          {/* ---------- FORM ---------- */}
          <form
            id="test-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* ---------- LEFT ---------- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border p-5 space-y-4">
                <h2 className="font-semibold text-lg">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Test Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-lg p-3"
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-lg p-3"
                      placeholder="Select Category"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Summary</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="Enter summary"
                    required
                  />
                </div>
              </div>

              {/* AI Prompt */}
              <div className="bg-white rounded-xl border p-5 space-y-3">
                <h2 className="font-semibold text-lg">AI Prompt</h2>
                <textarea
                  name="aiPrompt"
                  value={formData.aiPrompt}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter AI prompt"
                  required
                />
              </div>
            </div>

            {/* ---------- RIGHT ---------- */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-5 space-y-4">
                <h2 className="font-semibold text-lg">Settings</h2>

                <div>
                  <label className="text-sm font-medium">
                    Duration (min)
                  </label>
                  <input
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="Duration"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Passing Score (%)
                  </label>
                  <input
                    name="passingScore"
                    type="number"
                    value={formData.passingScore}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="0–100"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
