"use client";

import { useState, useEffect } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all required fields
    const requiredFields = [
      'title',
      'description',
      'education',
      'requiredExperience',
      'expiry',
      'category',
      'skills'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return !value || (Array.isArray(value) && value.length === 0);
    });
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      if (step === 1) {
        const step1Fields = ['title', 'description', 'education', 'requiredExperience', 'expiry'];
        const step1Missing = missingFields.filter(field => step1Fields.includes(field as string));
        if (step1Missing.length > 0) {
          setError(`Please fill all required fields: ${step1Missing.join(', ')}`);
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

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-1">
      {error && <p className="bg-red-50 text-red-600 p-2 rounded-lg">{error}</p>}

      <div className="relative border rounded-md p-6 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            width: "200%",
            transform: step === 1 ? "translateX(2%)" : "translateX(-52%)",
          }}
        >
          <div className="w-1/2 pr-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input
                placeholder="e.g. Frontend Developer..."
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description *
              </label>
              <textarea
                placeholder="Describe the job responsibilities..."
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education *
              </label>
              <input
                placeholder="eg. Bachelor’s in Computer Science..."
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="expiry"
                  min={getMinDate()}
                  value={formData.expiry}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience *
                </label>
                <input
                  placeholder="e.g. 2+ Years..."
                  name="requiredExperience"
                  value={formData.requiredExperience}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                onClick={() => {
                  const requiredFields = [
                    'title',
                    'description',
                    'education',
                    'requiredExperience',
                    'expiry'
                  ];
                  
                  const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
                  
                  if (missingFields.length > 0) {
                    setError(`Please fill all required fields: ${missingFields.join(', ')}`);
                    return;
                  }
                  
                  setError('');
                  setStep(2);
                }}
              >
                Next →
              </button>
            </div>
          </div>

          <div className="w-1/2 pl-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                {categories.map((cat: { _id: string; name: string }) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required Skills *
              </label>

              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto border p-3 rounded-md">
                {skillsResponse.map((skill: { _id: string; name: string }) => (
                  <label
                    key={skill._id}
                    className="flex gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill._id)}
                      onChange={() => handleSkillToggle(skill._id)}
                    />
                    {skill.name}
                  </label>
                ))}
              </div>

              {formData.skills.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {formData.skills.length} skills selected
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 rounded-md cursor-pointer"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700 disabled:opacity-40"
              >
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Job"
                  : "Update Job"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
