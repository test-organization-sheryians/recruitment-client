"use client";

import React, { useEffect, useState } from "react";
import { useCreateTest, useGetTest, useUpdateTest } from "../hooks/useTest";
import { useToast } from "@/components/ui/Toast";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestFormValues } from "@/types/Test";

import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";



/* ---------- UI FORM TYPE ---------- */
interface FormData {
  title: string;
  summary: string;
  category: string;
  duration: string;
  passingScore: string;
  aiPrompt: string;
  questionCount: number; // Number of Questions 
  questionType: string; // MCQ/Theory
  skills : string[];
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
  const { data: skillsData } = useGetAllSkills()
  const { success, error } = useToast();
  const skillsResponse = skillsData ?? [];
  
  const [searchTerm, setSearchTerm] = useState("");

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
    questionCount: 10, // Default to 10
    questionType: "THEORY", // Default to MCQ
    skills: []
  });

  /* ---------- PREFILL ---------- */
  useEffect(() => {
    if (data && formData.title === "" && !testId) return;
    if (!data) return;

    setFormData({
    title: data.title ?? "",
    summary: data.summury ?? "",
    category: data.category ?? "",
    duration: String(data.duration ?? ""),
    passingScore: String(data.passingScore ?? ""),
    aiPrompt: data.prompt ?? "",
    questionCount: data.questionCount ?? 10,
    questionType: (data.questionType as string)?.toUpperCase() === "THEORY" ? "THEORY" : "MCQ",
    skills: data.skills ?? []
  });
  }, [data , testId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;
    
    if (name === "duration") {
      if (Number(value) > 120) { finalValue = "120"; }
    }
    if (name === "passingScore") {
      if (Number(value) > 100) finalValue = "100";
    }
   if (name === "questionCount") {
    finalValue = Number(value);
  }

  if (name === "questionType") {
    finalValue = value.toUpperCase(); 
  }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  /* ---------- SKILL LOGIC ---------- */
  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => {
      const isSelected = prev.skills.includes(skillId);
      if (isSelected) {
        return { ...prev, skills: prev.skills.filter((id) => id !== skillId) };
      } else {
        return { ...prev, skills: [...prev.skills, skillId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    const durationNum = Number(formData.duration);
    const scoreNum = Number(formData.passingScore);

    // Final Validation Alert
    if (durationNum > 120) return error("Duration cannot be more than 120 minutes.");
    if (scoreNum > 100) return error("Passing score cannot exceed 100%.");

    const formatInstruction = formData.questionType === "THEORY" 
      ? "GENERATE OPEN-ENDED THEORY QUESTIONS ONLY. DO NOT PROVIDE MULTIPLE CHOICE OPTIONS OR A/B/C/D ANSWERS." 
      : "GENERATE MULTIPLE CHOICE QUESTIONS (MCQ) WITH 4 OPTIONS EACH AND ONE CORRECT ANSWER.";

    const enhancedPrompt = `${formData.aiPrompt}
  
  STRICT REQUIREMENTS:
- Format: ${formData.questionType}
- Question Count: ${formData.questionCount}
- Instructions: ${formatInstruction}`;

    const payload : TestFormValues = {
      title: formData.title,
      summury: formData.summary,
      description: formData.summary,
      category: formData.category,
      duration: durationNum,
      passingScore: scoreNum,
      prompt: enhancedPrompt,
      showResults: true,
      questionCount: formData.questionCount, // added question no.
      questionType: formData.questionType as "MCQ" | "THEORY", // added Types
      skills: formData.skills, // Add skills to payload
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
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">


          {/* ---------- HEADER ---------- */}
          <div className="sticky top-0 z-20 bg-[#121212] p-6 border-b border-gray-800 flex items-start justify-between shrink-0 rounded-t-2xl">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
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
          <div className="overflow-y-auto p-6 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="Enter Description"
                    required
                  />
                </div>
              </div>


              {/* SKILLS SECTION (NEWLY ADDED) */}
              <div className="bg-white rounded-xl border p-5 space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Required Skills *
                </label>

                <input
                  type="text"
                  placeholder="Search and add skills (e.g. React, Node...)"
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Search Results */}
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
                  {skillsResponse
                    .filter(s =>
                      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      !formData.skills.includes(s._id)
                    )
                    .slice(0, 10)
                    .map((skill) => (
                      <button
                        key={skill._id}
                        type="button"
                        onClick={() => {
                          handleSkillToggle(skill._id);
                          setSearchTerm("");
                        }}
                        className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                      >
                        + {skill.name}
                      </button>
                    ))}
                </div>

                {/* Selected Skills Tags */}
                {formData.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      {formData.skills.map((skillId) => {
                        const skillName = skillsResponse.find(s => s._id === skillId)?.name;
                        return (
                          <span key={skillId} className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                            {skillName}
                            <button type="button" onClick={() => handleSkillToggle(skillId)} className="hover:text-red-500 font-bold ml-1">×</button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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

                {/* Question Count */}
    <div>
      <label className="text-sm font-medium">Number of Questions</label>
      <input
        name="questionCount"
        type="number"
        min={1}
        max={50} // Optional limit
        value={formData.questionCount}
        onChange={handleChange}
        className="mt-1 w-full border rounded-lg p-3"
        required
      />
    </div>

    {/* Question Type Selection */}
    <div>
      <label className="text-sm font-medium">Question Type</label>
      <select
        name="questionType"
        value={formData.questionType}
        onChange={handleChange} 
        className="mt-1 w-full border rounded-lg p-3 bg-white text-gray-900 font-medium"
      >
        <option value="MCQ">Multiple Choice (MCQ)</option>
        <option value="THEORY">Theory / Written</option>
      </select>
    </div>

                <div>
                  <label className="text-sm font-medium">Duration (min)</label>
                  <input
                    name="duration"
                    type="number"
                    min={1}
                    max={120}
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="Max 120"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Maximum limit: 120 minutes (2 hours)</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Passing Score (%)</label>
                  <input
                    name="passingScore"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.passingScore}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg p-3"
                    placeholder="0–100"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Range: 1% to 100%</p>
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}
