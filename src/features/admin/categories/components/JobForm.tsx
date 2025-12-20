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

interface Location {
  city: string;
  state: string;
  pincode: string;
  country: string
}

export interface JobFormData {
  _id?: string;
  title: string;
  description: string;
  education: string;
  requiredExperience: string;
  category: string;
  skills: string[];
  expiry: string;
  clientId: string;
  location: Location; // added Location
}

interface JobFormProps {
  mode: "create" | "update";
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
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
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [] } = useGetJobCategories();
  const { data: skillsResponse = [] } = useGetAllSkills();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    requiredExperience: initialData?.requiredExperience || "",
    category: typeof initialData?.category === 'string'
      ? initialData.category
      : (initialData?.category as unknown as Category)?._id || "",
    education: initialData?.education || "",
    description: initialData?.description || "",
    location: {
      city: initialData?.location?.city || "",
      state: initialData?.location?.state || "",
      pincode: initialData?.location?.pincode || "",
      country: initialData?.location?.country || "",
    },       // added Location 
    skills: Array.isArray(initialData?.skills)
      ? (initialData.skills as (string | Skill)[]).map((s) =>
        typeof s === "string" ? s : s._id
      )
      : [],
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

  const handleLocationChange = (key: keyof Location, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  };


  const handleSubmit = async () => {
    setError("");

    const isLocationValid = Object.values(formData.location).every(Boolean);

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

    if (!isLocationValid) {
      setError("Please fill all location fields");
      return;
    }

    if (missingFields.length > 0) {
      if (step === 1) {
        const step1Fields = [
          "title",
          "description",
          "education",
          "requiredExperience",
          "expiry",
        ];

        const step1Missing = missingFields.filter((field) =>
          step1Fields.includes(field)
        );

        if (step1Missing.length > 0) {
          setError(
            `Please fill all required fields: ${step1Missing.join(", ")}`
          );
          return;
        }
      } else {
        setError(`Please fill all required fields: ${missingFields.join(", ")}`);
        return;
      }
    }
    try {
      console.log("Submitting Payload:", formData);
      await onSubmit(formData);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string
      };
      const msg = error.response?.data?.message || error.message || "Update failed";
      setError(msg);
    }
  };


  const getMinDate = () =>
    new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const isStep1Valid =
    formData.title &&
    formData.description &&
    formData.education &&
    formData.expiry &&
    formData.requiredExperience &&
    formData.location.city &&
    formData.location.state &&
    formData.location.pincode &&
    formData.location.country;

  return (
    <div className="w-full h-full py-3 rounded-md mb-2">
      <div className="w-full mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

                  {/* {/* Location Added */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Location Required *
                    </label>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        placeholder="City"
                        value={formData.location.city}
                        onChange={(e) => handleLocationChange("city", e.target.value)}
                        className="w-full border-2 border-gray-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                      <input
                        placeholder="State"
                        value={formData.location.state}
                        onChange={(e) => handleLocationChange("state", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                      <input
                        placeholder="Pincode"
                        value={formData.location.pincode}
                        onChange={(e) => handleLocationChange("pincode", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                      <input
                        placeholder="Country"
                        value={formData.location.country}
                        onChange={(e) => handleLocationChange("country", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
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
                    {categories.map((cat: { _id: string; name: string }) => (
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

                  {/* 1. Search Bar */}
                  <input
                    type="text"
                    placeholder="Search and add skills (e.g. React, Node...)"
                    className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)} // You'll need to add a [searchTerm, setSearchTerm] state
                  />

                  {/* 2. Search Results */}
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

                  {/* 3. Selected Skills Display (The "Tags" view) */}
                  {formData.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Selected Skills:</p>
                      <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        {formData.skills.map((skillId) => {
                          const skillName = skillsResponse.find(s => s._id === skillId)?.name;
                          return (
                            <span key={skillId} className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                              {skillName}
                              <button
                                type="button"
                                onClick={() => handleSkillToggle(skillId)}
                                className="hover:text-red-500 font-bold ml-1"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
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
