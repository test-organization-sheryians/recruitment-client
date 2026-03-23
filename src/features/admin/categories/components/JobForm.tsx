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
  country: string;
}

export interface JobFormData {
  _id?: string;
  title: string;
  description: string;
  education: string;
  requiredExperience: number;
  category: string;
  skills: string[];
  expiry: string;
  clientId: string;
  location: Location;
  jobType: "Remote" | "Hybrid" | "Full-Time" | "Part-Time";
  salary: {
    min: number;
    max: number;
    currency?: string;
  };
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
  const safeInitialData = initialData || {};
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    loading: boolean;
    message: string;
    type: "info" | "error" | "";
  }>({
    loading: false,
    message: "",
    type: "",
  });

  const { data: categories = [] as Category[] } = useGetJobCategories();
  const { data: skillsResponse = [] as Skill[] } = useGetAllSkills();

  const [formData, setFormData] = useState<JobFormData>({
    title: safeInitialData.title || "",
    requiredExperience: Number(safeInitialData.requiredExperience) || 0,
    category:
      typeof safeInitialData.category === "string"
        ? safeInitialData.category
        : ((safeInitialData.category as any)?._id ?? ""),
    education: safeInitialData.education || "",
    description: safeInitialData.description || "",
    jobType: safeInitialData.jobType || "Full-Time",
    salary: {
      min: safeInitialData.salary?.min ?? 10000,
      max: safeInitialData.salary?.max ?? 30000,
      currency: safeInitialData.salary?.currency ?? "INR",
    },
    location: {
      city: safeInitialData.location?.city || "",
      state: safeInitialData.location?.state || "",
      pincode: safeInitialData.location?.pincode || "",
      country: safeInitialData.location?.country || "",
    },
    skills: Array.isArray(safeInitialData.skills)
      ? safeInitialData.skills.map((s) =>
          typeof s === "string" ? s : (s as any)._id,
        )
      : [],
    expiry: safeInitialData.expiry
      ? new Date(safeInitialData.expiry).toISOString().split("T")[0]
      : "",
    clientId: safeInitialData.clientId || "6915b90df6594de75060410b",
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
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "requiredExperience" ? Number(value) : value,
    }));
  };

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

  useEffect(() => {
    const pincode = formData.location.pincode?.trim();
    if (!pincode) {
      setPincodeStatus({ loading: false, message: "", type: "" });
      return;
    }
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeStatus({
        loading: false,
        message: "Enter 6-digit pincode",
        type: "error",
      });
      return;
    }

    let cancelled = false;
    setPincodeStatus({ loading: true, message: "Searching...", type: "info" });

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
        );
        const data = await res.json();
        if (cancelled) return;

        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              city: po.District,
              state: po.State,
              country: po.Country || "India",
            },
          }));
          setPincodeStatus({
            loading: false,
            message: `Found: ${po.District}`,
            type: "info",
          });
        } else {
          setPincodeStatus({
            loading: false,
            message: "Not found",
            type: "error",
          });
        }
      } catch (err) {
        if (!cancelled)
          setPincodeStatus({
            loading: false,
            message: "API Error",
            type: "error",
          });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [formData.location.pincode]);

  const handleSubmit = async () => {
    setError("");

    // Validation
    const { title, description, skills, salary, location } = formData;
    if (!title || !description || skills.length === 0) {
      setError("Please fill required job details and skills");
      return;
    }
    if (salary.min > salary.max) {
      setError("Min salary cannot exceed max salary");
      return;
    }
    if (!location.city || !location.pincode) {
      setError("Please provide a valid location");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Submit failed");
    }
  };

  const isStep1Valid = !!(
    formData.title &&
    formData.description &&
    formData.location.pincode
  );

  return (
    <div className="w-full h-full py-3">
      <div className="bg-white rounded-3xl shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
            {error}
          </div>
        )}

        <div className="relative overflow-hidden">
          <div
            className="flex transition-all duration-500"
            style={{
              width: "200%",
              transform: step === 1 ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Step 1 */}
            <div className="w-1/2 pr-4 space-y-4">
              {/* Inputs go here - same as your original JSX */}
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full border p-3 rounded-xl"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-3 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Pincode"
                  value={formData.location.pincode}
                  onChange={(e) =>
                    handleLocationChange("pincode", e.target.value)
                  }
                  className="border p-3 rounded-xl"
                />
                <input
                  placeholder="City"
                  value={formData.location.city}
                  readOnly
                  className="border p-3 rounded-xl bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full bg-blue-600 text-white p-3 rounded-xl"
              >
                Continue
              </button>
            </div>

            {/* Step 2 */}
            <div className="w-1/2 pl-4 space-y-4">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              >
                {categories.map((c: Category) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {/* Skills Logic */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 text-white p-3 rounded-xl"
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
    </div>
  );
}
