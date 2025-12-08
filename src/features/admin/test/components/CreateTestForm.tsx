"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTest, useGetTest, useUpdateTest } from "../hooks/useTest";
import { useToast } from "@/components/ui/Toast";

import {
  BookOpen,
  FileText,
  Tag,
  Clock,
  Target,
  CheckCircle,
  X,
} from "lucide-react";

interface FormData {
  title: string;
  summary: string;
  category: string;
  duration: string;
  passingScore: string;
  aiPrompt: string;
}

interface Errors {
  [key: string]: string;
}

export default function CreateTestForm({
  testId,
  onClose,
}: {
  testId?: string;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    summary: "",
    category: "",
    duration: "",
    passingScore: "",
    aiPrompt: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const { success, error: showError } = useToast();

  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const isLoading =
    createTest.status === "pending" || updateTest.status === "pending";

  const testQuery = useGetTest(testId ?? "");

  useEffect(() => {
    if (testId && testQuery.data) {
      const t = testQuery.data;

      setFormData({
        title: t.title || "",
        summary: t.summary || "",
        category: t.category || "",
        duration: t.duration?.toString() || "",
        passingScore: t.passingScore?.toString() || "",
        aiPrompt: t.prompt || "",
      });
    }
  }, [testQuery.data, testId]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    const durationNum = parseInt(formData.duration);
    if (!durationNum || durationNum < 1)
      newErrors.duration = "Duration must be at least 1 minute";

    const scoreNum = parseInt(formData.passingScore);
    if (scoreNum < 0 || scoreNum > 100)
      newErrors.passingScore = "Passing score must be between 0 and 100";

    if (!formData.aiPrompt.trim())
      newErrors.aiPrompt = "AI prompt is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: testId,
      title: formData.title,
      summary: formData.summary,
      description: formData.summary,
      duration: parseInt(formData.duration),
      category: formData.category,
      passingScore: parseInt(formData.passingScore),
      prompt: formData.aiPrompt,
    };

    try {
      if (testId) {
        await updateTest.mutateAsync(payload);
        success("Test updated successfully!");
        setSuccessMessage("Test updated successfully!");
      } else {
        await createTest.mutateAsync(payload);
        success("Test created successfully!");
        setSuccessMessage("Test created successfully!");

        setFormData({
          title: "",
          summary: "",
          category: "",
          duration: "",
          passingScore: "",
          aiPrompt: "",
        });
      }

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      showError(message);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"></div>

      {/* MODAL CONTAINER (your UI stays inside this) */}
      <div className="fixed inset-0 z-[1000] flex justify-center items-center overflow-y-auto p-4">
        <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl relative">

          {/* CLOSE BUTTON */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* YOUR ORIGINAL UI (UNCHANGED) */}
          <div className="min-h-[70vh] bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
            <div className="max-w-7xl mx-auto">

              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-1">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {testId ? "Update Assessment" : "Create New Assessment"}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {testId
                        ? "Modify assessment details"
                        : "Configure assessment details"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    form="create-test-form"
                    className="px-4 py-2 bg-blue-600 hover:bg-black text-white text-sm shadow-md"
                    disabled={isLoading}
                    aria-label={isLoading ? "Saving..." : testId ? "Update Test" : "Save & Generate"}
                  >
                    {isLoading
                      ? "Saving..."
                      : testId
                      ? "Update Test"
                      : "Save & Generate"}
                  </Button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {successMessage && (
                <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
              )}

              {/* FULL FORM (UNCHANGED) */}
              <form
                id="create-test-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4"
              >
                {/* BASIC INFO BLOCK */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                      Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <BookOpen className="w-4 h-4 text-teal-600" />
                          Test Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          aria-label="Test title"
                        />
                        {errors.title && (
                          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <Tag className="w-4 h-4 text-teal-600" />
                          Category
                        </label>
                        <select
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                          aria-label="Test category"
                        >
                          <option value="">Select Category</option>
                          <option value="Programming">Programming</option>
                          <option value="Aptitude">Aptitude</option>
                          <option value="English">English</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Technical">Technical</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <label htmlFor="summary" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <FileText className="w-4 h-4 text-teal-600" />
                        Summary
                      </label>
                      <textarea
                        name="summary"
                        id="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none min-h-[60px]"
                        aria-label="Test summary"
                      />
                      {errors.summary && (
                        <p className="text-red-500 text-xs mt-1">{errors.summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <label htmlFor="aiPrompt" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <FileText className="w-4 h-4 text-teal-600" />
                      AI Prompt
                    </label>
                    <textarea
                      name="aiPrompt"
                      id="aiPrompt"
                      value={formData.aiPrompt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm resize-none min-h-[140px]"
                      aria-label="AI prompt for test generation"
                    />
                    {errors.aiPrompt && (
                      <p className="text-red-500 text-xs mt-1">{errors.aiPrompt}</p>
                    )}
                  </div>
                </div>

                <aside className="lg:col-span-1 space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Settings
                    </h3>

                    <div>
                      <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4 text-gray-600" />
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        aria-label="Test duration in minutes"
                      />
                      {errors.duration && (
                        <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="passingScore" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Target className="w-4 h-4 text-gray-600" />
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        name="passingScore"
                        id="passingScore"
                        value={formData.passingScore}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        aria-label="Passing score percentage"
                      />
                      {errors.passingScore && (
                        <p className="text-red-500 text-xs mt-1">{errors.passingScore}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">
                      Controls
                    </h4>
                    <p className="text-xs text-gray-500">
                      (UI only — backend not linked yet)
                    </p>
                  </div>
                </aside>
              </form>
            </div>
          </div>

          {/* END original UI */}
        </div>
      </div>
    </>
  );
}