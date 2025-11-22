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

  // Set default category if available
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
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.education ||
        !formData.requiredExperience ||
        !formData.category ||
        !formData.expiry
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Create FormData object
      const formDataObj = new FormData();

      // Append each field to FormData
      formDataObj.append("title", formData.title);
      formDataObj.append("requiredExperience", formData.requiredExperience);
      formDataObj.append("category", formData.category);
      formDataObj.append("education", formData.education);
      formDataObj.append("description", formData.description);

      // Append each skill individually
      formData.skills.forEach((skill, index) => {
        formDataObj.append(`skills[${index}]`, skill);
      });

      if (formData.expiry) {
        formDataObj.append("expiry", new Date(formData.expiry).toISOString());
      }

      formDataObj.append("clientId", formData.clientId);

      const response = await createJob(formDataObj);

      if (response.success) {
        setIsSuccess(true);
        // Close dialog and refresh after 1.5 seconds
        setTimeout(() => {
          onJobCreated?.();
          router.push("/admin/jobs");
          router.refresh();
        }, 1500);
      } else {
        setError(response.message || "Failed to create job");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      setError("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for expiry (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full h-full  bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="text-green-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700">
              The job has been created successfully!
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 border-b border-red-200 p-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Job Title */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* LEFT SIDE FORM FIELDS */}
                <div className="flex-1 space-y-6">
                  {/* Job Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Senior Backend Developer"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Job Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the job responsibilities..."
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label
                      htmlFor="education"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Education Requirements *
                    </label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      required
                      value={formData.education}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Bachelor of Computer Science"
                    />
                  </div>

                  {/* Expiry + Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Application Deadline *
                      </label>
                      <input
                        type="date"
                        id="expiry"
                        name="expiry"
                        required
                        value={formData.expiry}
                        onChange={handleChange}
                        min={getMinDate()}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          text-sm transition"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requiredExperience"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Required Experience *
                      </label>
                      <input
                        type="text"
                        id="requiredExperience"
                        name="requiredExperience"
                        required
                        value={formData.requiredExperience}
                        onChange={handleChange}
                        placeholder="e.g., 3+ years"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
          shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 text-sm transition"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE SKILLS SECTION */}
                {/* <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills {isLoadingSkills && "(Loading...)"}
                  </label>

                  <select
                    id="skills-select"
                    multiple
                    value={formData.skills}
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        skills: selectedOptions,
                      }));
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300
      focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md min-h-[200px]"
                  >
                    {skills?.map((skill: Skill) => (
                      <option key={skill._id} value={skill._id} className="p-2">
                        {skill.name}
                      </option>
                    ))}
                  </select>

                  {!isLoadingSkills && skills.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      No skills available. Please add skills first.
                    </p>
                  )}

                  {formData.skills.length > 0 && (
                    <p className="mt-1 text-xs text-blue-600 font-medium">
                      {formData.skills.length} selected
                    </p>
                  )}

                  <p className="mt-1 text-xs text-gray-500">
                    Hold Ctrl (or Cmd on Mac) to select multiple skills
                  </p>
                  <div className="flex justify-end space-x-3 pt-4 border-gray-200">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Creating Job...
                        </div>
                      ) : (
                        "Create Job Role"
                      )}
                    </button>
                  </div>
                </div> */}
              </div>

              {/* yaha change huaa hai */}

              {/* Form Actions */}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
