"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Calendar,
  Clock,
  FolderOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";
import { useGetJobCategories } from "../hooks/useJobCategoryApi";

interface Skill {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface JobFormData {
  _id?: string;
  title: string;
  description: string;
  education: string;
  requiredExperience: string;
  category: Category;
  skills: Skill[];
  expiry: string;
  clientId: string;
}

interface JobFormProps {
  mode: "create" | "update";
  initialData?: Partial<JobFormData>;
  onSubmit: (data: { [key: string]: string | string[] }) => Promise<void>;
  loading?: boolean;
}

export default function JobForm({
  mode,
  initialData,
  onSubmit,
  loading = false,
}: JobFormProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const { data: categories = [] } = useGetJobCategories();
  const { data: skillsResponse = [] } = useGetAllSkills();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    requiredExperience: initialData?.requiredExperience || "",
    category: (initialData?.category as Category)?._id || "",
    education: initialData?.education || "",
    description: initialData?.description || "",
    skills: initialData?.skills?.map((s: { _id: string }) => s._id) || [],
    expiry: initialData?.expiry
      ? new Date(initialData.expiry).toISOString().split("T")[0]
      : "",
    clientId: initialData?.clientId || "6915b90df6594de75060410b",
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0]._id,
      }));
    }
  }, [categories]);

  const handleChange = (e: { target: { name: string; value: string } }) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id: string) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleSubmit = async () => {
    setError("");

    // Validate all required fields
    const requiredFields = [
      "title",
      "description",
      "education",
      "requiredExperience",
      "expiry",
      "category",
      "skills",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      if (step === 1) {
        const step1Fields = [
          "title",
          "description",
          "education",
          "requiredExperience",
          "expiry",
        ];
        const step1Missing = missingFields.filter((field) =>
          step1Fields.includes(field as string)
        );
        if (step1Missing.length > 0) {
          setError(
            `Please fill all required fields: ${step1Missing.join(", ")}`
          );
          return;
        }
      } else {
        return;
      }
    }

    await onSubmit(formData);
  };

  const getMinDate = () =>
    new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const isStep1Valid =
    formData.title &&
    formData.description &&
    formData.education &&
    formData.expiry &&
    formData.requiredExperience;

  return (
    <div className="w-full h-full py-3 rounded-md mb-2">
      <div className="w-full mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-2 border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="relative overflow-hidden">
            <div
              className="flex transition-all duration-500 ease-in-out"
              style={{
                width: "200%",
                transform: step === 1 ? "translateX(1%)" : "translateX(-50%)",
              }}
            >
              {/* Step 1: Basic Information */}
              <div className="w-1/2 pr-8 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Job Title *
                  </label>
                  <input
                    placeholder="e.g. Senior Frontend Developer"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Job Description *
                  </label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Education Required *
                  </label>
                  <input
                    placeholder="e.g. Bachelor's in Computer Science or equivalent"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      name="expiry"
                      min={getMinDate()}
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Experience Required *
                    </label>
                    <input
                      placeholder="e.g. 3-5 Years"
                      name="requiredExperience"
                      value={formData.requiredExperience}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => isStep1Valid && setStep(2)}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="w-1/2 pl-8 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    Job Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Required Skills *
                  </label>

                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    {skillsResponse.map((skill: any) => (
                      <label
                        key={skill._id}
                        className="group flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-all border-2 border-transparent hover:border-blue-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill._id)}
                          onChange={() => handleSkillToggle(skill._id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {skill.name}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-700">
                        {formData.skills.length} skill
                        {formData.skills.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6 gap-4">
                  <button
                    type="button"
                    className="group flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all text-gray-700"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {mode === "create" ? "Create Job" : "Update Job"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
