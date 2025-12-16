"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTest, useGetTest, useUpdateTest } from "../hooks/useTest";
import { useToast } from "@/components/ui/Toast";
import { BookOpen, CheckCircle, X } from "lucide-react";

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

// Define the expected payload interface based on the error messages
interface TestPayload {
  id?: string;
  title: string;
  summary: string;
  description: string;
  duration: number;
  category: string;
  passingScore: number;
  prompt: string;
}

export default function CreateTestForm({
  testId,
  onClose,
}: {
  testId?: string;
  onClose: () => void;
}) {
  const { success, error: showError } = useToast();
  const testQuery = useGetTest(testId ?? "", { enabled: !!testId });

  // Initialize with empty form data
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
  const [isInitialized, setIsInitialized] = useState(false);

  const createTest = useCreateTest();
  const updateTest = useUpdateTest();

  const isLoading =
    createTest.status === "pending" || updateTest.status === "pending";

  // Load data when editing
  useEffect(() => {
    if (testId && testQuery.data && !isInitialized) {
      setFormData({
        title: testQuery.data.title || "",
        summary: testQuery.data.summury || "", // Fixed typo: summury → summary
        category: testQuery.data.category || "",
        duration: testQuery.data.duration?.toString() || "",
        passingScore: testQuery.data.passingScore?.toString() || "",
        aiPrompt: testQuery.data.prompt || "",
      });
      setIsInitialized(true);
    }
  }, [testId, testQuery.data, isInitialized]);

  // Reset when creating new test
  useEffect(() => {
    if (!testId) {
      setFormData({
        title: "",
        summary: "",
        category: "",
        duration: "",
        passingScore: "",
        aiPrompt: "",
      });
      setIsInitialized(true);
    }
  }, [testId]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    const durationNum = parseInt(formData.duration);
    if (!durationNum || durationNum < 1)
      newErrors.duration = "Duration must be at least 1 minute";

    const scoreNum = parseInt(formData.passingScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100)
      newErrors.passingScore = "Passing score must be between 0 and 100";

    if (!formData.aiPrompt.trim())
      newErrors.aiPrompt = "AI prompt is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 🟥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload : TestPayload = {
      title: formData.title,
      summary: formData.summary,
      description: formData.summary, // Using summary for description as in original code
      duration: parseInt(formData.duration),
      category: formData.category,
      passingScore: parseInt(formData.passingScore),
      prompt: formData.aiPrompt,
    };

    // Only add id for updates
    if (testId) {
      payload.id = testId;
    }

    try {
      if (testId) {
        await updateTest.mutateAsync(payload);
        success("Test updated successfully!");
        setSuccessMessage("Test updated successfully!");
      } else {
        await createTest.mutateAsync(payload);
        success("Test created successfully!");
        setSuccessMessage("Test created successfully!");

        // Reset form for new creation
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

      {/* MODAL */}
      <div className="fixed inset-0 z-[1000] flex justify-center items-center overflow-y-auto p-4">
        <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl relative">
          {/* CLOSE BUTTON */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
            onClick={onClose}
            aria-label="Close modal"
            title="Close"
          >
            <X size={24} />
          </button>

          {/* FORM MAIN */}
          <div className="min-h-[70vh] bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
            <div className="max-w-7xl mx-auto">
              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-1">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
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
                    className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50"
                    aria-label="Cancel"
                    title="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              {successMessage && (
                <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
              )}

              {/* FORM */}
              <form
                id="create-test-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4"
                aria-label="Assessment form"
              >
                {/* LEFT SIDE */}
                <div className="lg:col-span-4 space-y-4">
                  {/* BASIC INFO */}
                  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-3">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label htmlFor="title" className="text-sm font-semibold">
                          Test Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          aria-label="Test title"
                          aria-required="true"
                          placeholder="Enter test title"
                        />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="category" className="text-sm font-semibold">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                          aria-label="Test category"
                          aria-required="true"
                          title="Select test category"
                        >
                          <option value="">Select Category</option>
                          <option value="Programming">Programming</option>
                          <option value="Aptitude">Aptitude</option>
                          <option value="English">English</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Technical">Technical</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <label htmlFor="summary" className="text-sm font-semibold">
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none min-h-[60px]"
                        aria-label="Test summary"
                        aria-required="true"
                        placeholder="Enter test summary"
                      />
                      {errors.summary && <p className="text-red-500 text-xs">{errors.summary}</p>}
                    </div>
                  </div>

                  {/* AI PROMPT */}
                  <div className="bg-white rounded-xl shadow p-5 border">
                    <label htmlFor="aiPrompt" className="text-sm font-semibold">
                      AI Prompt
                    </label>
                    <textarea
                      id="aiPrompt"
                      name="aiPrompt"
                      value={formData.aiPrompt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm resize-none min-h-[140px]"
                      aria-label="AI prompt for test generation"
                      aria-required="true"
                      placeholder="Enter AI prompt for test generation"
                    />
                    {errors.aiPrompt && <p className="text-red-500 text-xs">{errors.aiPrompt}</p>}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <aside className="lg:col-span-1 space-y-4">
                  <div className="bg-white rounded-xl p-4 border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Settings</h3>

                    <div>
                      <label htmlFor="duration" className="text-sm font-medium">
                        Duration (min)
                      </label>
                      <input
                        id="duration"
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        aria-label="Test duration in minutes"
                        aria-required="true"
                        placeholder="Duration in minutes"
                        min="1"
                      />
                      {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="passingScore" className="text-sm font-medium">
                        Passing Score (%)
                      </label>
                      <input
                        id="passingScore"
                        type="number"
                        name="passingScore"
                        value={formData.passingScore}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        aria-label="Passing score percentage"
                        aria-required="true"
                        placeholder="0-100"
                        min="0"
                        max="100"
                      />
                      {errors.passingScore && (
                        <p className="text-red-500 text-xs">{errors.passingScore}</p>
                      )}
                    </div>
                  </div>
                </aside>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}