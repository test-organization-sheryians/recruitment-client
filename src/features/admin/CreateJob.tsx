"use client";

import { useState, useEffect } from "react";
import { createJob } from "@/api/jobs";
import { useRouter } from "next/navigation";
import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";
import { useGetJobCategories } from "./categories/hooks/useJobCategoryApi";

interface Category {
  _id: string;
  name: string;
}

interface Skill {
  _id: string;
  name: string;
}

interface CreateJobProps {
  onJobCreated?: () => void;
}

interface FormData {
  title: string;
  description: string;
  education: string;
  requiredExperience: string;
  skills: string[];
  expiry: string;
  category: string;
  clientId: string;
}

export default function CreateJob({ onJobCreated }: CreateJobProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetJobCategories();
  const { data: skillsResponse, isLoading: isLoadingSkills } =
    useGetAllSkills();
  const skills = skillsResponse || [];
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    requiredExperience: "",
    category: "",
    education: "",
    description: "",
    skills: [],
    expiry: "",
    clientId: "6915b90df6594de75060410b",
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0]._id,
      }));
    }
  }, [categories, formData.category]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataObj = new FormData();

      formDataObj.append("title", formData.title);
      formDataObj.append("requiredExperience", formData.requiredExperience);
      formDataObj.append("category", formData.category);
      formDataObj.append("education", formData.education);
      formDataObj.append("description", formData.description);

      formData.skills.forEach((skill, index) =>
        formDataObj.append(`skills[${index}]`, skill)
      );

      if (formData.expiry) {
        formDataObj.append("expiry", new Date(formData.expiry).toISOString());
      }

      formDataObj.append("clientId", formData.clientId);

      const response = await createJob(formDataObj);

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onJobCreated?.();
          router.push("/admin/jobs");
          router.refresh();
        }, 1500);
      } else {
        setError(response.message || "Failed to create job");
      }
    } catch (err) {
      setError("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isSuccess ? (
          <div className="p-6 text-green-600 text-center">
            Job Created Successfully!
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 text-red-600 p-3">{error}</div>
            )}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-hidden"
            >
              <div className="relative w-full overflow-hidden">
                <div
                  className={`flex transition-transform duration-500`}
                  style={{
                    width: "200%",
                    transform:
                      step === 1 ? "translateX(0%)" : "translateX(-50%)",
                  }}
                >
                  <div className="w-1/2 pr-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job Title *
                      </label>
                      <input
                        name="title"
                        placeholder="e.g., Software Engineer..."
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job Description *
                      </label>
                      <textarea
                        placeholder="Describe the job responsibilities......"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Education *
                      </label>
                      <input
                        placeholder="e.g., Bachelor's in Computer Science..."
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Deadline *
                        </label>
                        <input
                          type="date"
                          name="expiry"
                          min={getMinDate()}
                          value={formData.expiry}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Experience *
                        </label>
                        <input
                          placeholder="e.g., 3+ years of experience..."
                          name="requiredExperience"
                          value={formData.requiredExperience}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
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
                        className="w-full border rounded-md p-2"
                        required
                      >
                        {categories.map((cat: any) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Required Skills {isLoadingSkills && "(Loading...)"}
                      </label>

                      <select
                        multiple
                        value={formData.skills}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skills: Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                            ),
                          })
                        }
                        className="w-full min-h-[200px] border rounded-md p-2"
                      >
                        {skills.map((skill: Skill) => (
                          <option key={skill._id} value={skill._id}>
                            {skill.name}
                          </option>
                        ))}
                      </select>

                      {formData.skills.length > 0 && (
                        <p className="text-xs text-blue-600">
                          {formData.skills.length} selected
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Hold Ctrl (or Cmd) to select multiple
                      </p>
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Required Skills *
                      </label>

                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                        {skills.map((skill: any) => (
                          <label
                            key={skill._id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={skill._id}
                              checked={formData.skills.includes(skill._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    skills: [...formData.skills, skill._id],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    skills: formData.skills.filter(
                                      (id) => id !== skill._id
                                    ),
                                  });
                                }
                              }}
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
                        onClick={() => setStep(1)}
                        className="px-6 py-2 bg-gray-300 rounded-md cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md cursor-pointer "
                      >
                        Create Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
