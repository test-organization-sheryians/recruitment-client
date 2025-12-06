"use client";

import React, { useState } from "react";
// Assuming "@/components/ui/button" is a standard Button component
import { Button } from "@/components/ui/button";
import { useCreateTest } from "../hooks/useTest";
import { useToast } from "@/components/ui/Toast";
import {
  BookOpen,
  FileText,
  Tag,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
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

export default function CreateTestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    summary: "",
    category: "",
    duration: "",
    passingScore: "",
    aiPrompt: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const createTest = useCreateTest();
  const { success, error: showError } = useToast();
  const isLoading = createTest?.status === "pending";

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.summary.trim())
      newErrors.summary = "Summary is required";
    if (!formData.category.trim())
      newErrors.category = "Category is required";
    
    // Check if duration is a valid number at least 1
    const durationNum = parseInt(formData.duration);
    if (!formData.duration || isNaN(durationNum) || durationNum < 1)
      newErrors.duration = "Duration must be at least 1 minute";
      
    // Check if passingScore is a valid number between 0 and 100
    const scoreNum = parseInt(formData.passingScore);
    if (
      !formData.passingScore || 
      isNaN(scoreNum) ||
      scoreNum < 0 ||
      scoreNum > 100
    )
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const durationNum = parseInt(formData.duration);
      const scoreNum = parseInt(formData.passingScore);

      const payload = {
        title: formData.title,
        summary: formData.summary,
        description: formData.summary,
        duration: durationNum,
        category: formData.category,
        passingScore: scoreNum,
        prompt: formData.aiPrompt,
      };

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
      setTimeout(() => setSuccessMessage(""), 4000);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error("Error creating test:", err);
      const msg = err instanceof Error ? err.message : String(err);
      showError(msg || "Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-1">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm flex-shrink-0">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Assessment</h1>
              <p className="text-sm text-gray-600">Configure core details and AI generation prompts.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              form="create-test-form"
              className="px-4 py-2 bg-blue-600 hover:bg-black text-white text-sm shadow-md"
              disabled={isSubmitting || isLoading}
              aria-busy={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Saving..." : "Save & Generate"}
            </Button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        <form id="create-test-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left/Main column - Takes 4/5ths of the space */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Basic Information Block */}
            <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title Field - Fixed direct implementation */}
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      Test Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Advanced JavaScript Assessment"
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                        errors.title
                          ? "border-red-300 focus:ring-2 focus:ring-red-200"
                          : "border-gray-300 focus:ring-2 focus:ring-teal-500"
                      } focus:outline-none focus:border-transparent`}
                    />
                    {errors.title && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Field */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <Tag className="w-4 h-4 text-teal-600" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    title="Category"
                    aria-label="Category"
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                      errors.category
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500"
                    } focus:outline-none focus:border-transparent bg-white cursor-pointer`}
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
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Summary Field - Fixed direct implementation */}
              <div className="mt-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Write a short summary of the test for takers..."
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                      errors.summary
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500"
                    } focus:outline-none focus:border-transparent resize-none min-h-[60px]`}
                  />
                  {errors.summary && (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      {errors.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Prompt Block */}
            <div className="bg-white rounded-xl shadow p-5 border border-gray-100 w-full">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <FileText className="w-4 h-4 text-teal-600" />
                  AI Prompt
                </label>
                <textarea
                  name="aiPrompt"
                  value={formData.aiPrompt}
                  onChange={handleChange}
                  placeholder="E.g., 'Act as a senior software architect. Generate 10 multiple-choice questions about React Hooks, focusing on useEffect and useMemo. Questions must be medium difficulty.'"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${
                    errors.aiPrompt
                      ? "border-red-300 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:ring-2 focus:ring-teal-500"
                  } focus:outline-none focus:border-transparent resize-none min-h-[140px]`}
                />
                {errors.aiPrompt && (
                  <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    {errors.aiPrompt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right/Sidebar column - Now takes 1/5th of the space */}
          <aside className="lg:col-span-1 space-y-4">
            
            {/* Test Parameters Block */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Settings</h3>
              <div className="space-y-3">
                
                {/* Duration */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-700">Duration (min)</p>
                  </div>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.duration
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:ring-2 focus:ring-teal-500"
                    } focus:outline-none`}
                  />
                  {errors.duration && <p className="mt-1 text-xs text-red-600">{errors.duration}</p>}
                </div>

                {/* Passing Score */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-4 h-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-700">Passing Score (%)</p>
                  </div>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    placeholder="70"
                    min="0"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.passingScore
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:ring-2 focus:ring-teal-500"
                    } focus:outline-none`}
                  />
                  {errors.passingScore && <p className="mt-1 text-xs text-red-600">{errors.passingScore}</p>}
                </div>
              </div>
            </div>

            {/* Visibility Block */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Active Status</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" aria-label="Status" title="Status" defaultChecked />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300 transition-colors"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Show Results?</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" aria-label="Show Results" title="Show Results" defaultChecked />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300 transition-colors"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shuffle Questions?</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" aria-label="Shuffle Questions" title="Shuffle Questions" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300 transition-colors"></div>
                  </label>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}