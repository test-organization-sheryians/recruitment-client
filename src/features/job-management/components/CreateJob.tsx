"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";

// Clean imports pointing to your dedicated hook files
import { useCreateJob } from "../hooks/useJobApi";
import { useGetCategories, useGetSkills } from "../hooks/useJobApi";
import { usePincodeLookup } from "../hooks/usePincodeLookup";
import { JobSelect } from "../ui/JobSelect";

import JobDescriptionEditor from "./JobDescriptionEditor";

/* ================= TYPES ================= */

type Skill = {
  _id: string;
  name: string;
};

type Category = {
  _id: string;
  name: string;
};

type LocationForm = {
  city: string;
  state: string;
  country: string;
  pincode: string;
};

type CreateJobFormValues = {
  title: string;
  requiredExperience: number;
  category: string;
  education: string;
  jobType: string;
  description: string;
  expiry: string;
  skills: Skill[];
  salary: {
    min: number;
    max: number;
    currency?: string;
  };
  location: LocationForm;
  clientId: string;
};

type CreateJobPayload = Omit<CreateJobFormValues, "skills"> & {
  skills: string[];
};

/* ================= CONSTANTS ================= */

const today = new Date().toISOString().split("T")[0];

/* ================= COMPONENT ================= */

export default function CreateJob({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter();

  const [skillQuery, setSkillQuery] = useState("");

  // Replaced inline useQuery and fetchSkills with a clean custom hook
  const { data: skills = [] } = useGetSkills();

  const {
    data: categories = [],
    fetchNextPage: fetchMoreCategories,
    hasNextPage: categoriesHasNext,
    isFetchingNextPage: isFetchingMoreCategories,
  } = useGetCategories();

  const initialForm: CreateJobFormValues = {
    title: "",
    requiredExperience: 0,
    category: "",
    education: "",
    jobType: "Full-Time",
    description: "",
    expiry: "",
    skills: [],
    salary: {
      min: 0,
      max: 0,
      currency: "INR",
    },
    location: {
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    clientId: "6915b90df6594de75060410b",
  };

  const [form, setForm] = useState<CreateJobFormValues>(initialForm);

  const pincodeStatus = usePincodeLookup(form.location.pincode, (location) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        ...location,
      },
    }));
  });

  // Using your custom mutation hook instead of raw useMutation
  const { mutate: createNewJob, isPending, error } = useCreateJob();

  useEffect(() => {
    if (error) {
      toast.dismiss();
      const message = (error as any)?.response?.data?.message || "Failed to create job";
      toast.error(message);
    }
  }, [error]);

  const submitJob = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);

    if (!form.expiry) {
      toast.error("Please select an application deadline");
      return;
    }

    const selectedDate = new Date(form.expiry);
    if (selectedDate < t) {
      toast.error("Application deadline cannot be in the past");
      return;
    }

    if (
      !form.title ||
      !form.description ||
      !form.education ||
      form.requiredExperience === null ||
      form.requiredExperience === undefined ||
      !form.expiry ||
      !form.category ||
      form.skills.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // ✅ show loading toast
    toast.loading("Creating job...");

    // Execute the renamed mutation
    createNewJob(
      {
        title: form.title,
        description: form.description,
        education: form.education,
        requiredExperience: form.requiredExperience,
        expiry: form.expiry,
        category: form.category,
        skills: form.skills.map((s) => s._id),
        jobType: form.jobType || "Full-Time",
        salary: {
          min: form.salary.min,
          max: form.salary.max,
          currency: form.salary.currency || "INR",
        },
        location: {
          city: form.location.city,
          state: form.location.state,
          pincode: form.location.pincode,
          country: form.location.country || "India",
        },
        clientId: form.clientId,
      } as CreateJobPayload,
      {
        // Handle success logic here
        onSuccess: (res: any) => {
          toast.dismiss();

          // if jobId is not present in response then return
          // const jobId = res?.data?.data?._id; 
          const jobId = res?.data?._id;

          if (!jobId) {
            toast.error("Job created but Job ID not found");
            return;
          }

          toast.success("Job created successfully 🚀");

          setTimeout(() => {
            router.push(`/admin/screen/${jobId}`);
          }, 800);
        },
      }
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111218] dark:text-white min-h-screen">
      <main className="flex flex-col items-center py-12 px-4 sm:px-10">
        <div className="max-w-200 w-full flex flex-col gap-10">
          <div>
            <button
              className="text-sm text-gray-500 mb-2 cursor-pointer"
              onClick={() => {
                if (onClose) onClose();
                else router.back();
              }}
            >
              ← Back to Jobs
            </button>
            <h1 className="text-3xl font-black">Create New Job</h1>
            <p className="text-gray-500">
              Fill in the details below to post a new job opening.
            </p>
          </div>

          <section className="p-0 border-none bg-transparent shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase size={14} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">Job Details</h3>
            </div>

            <div className="flex flex-col gap-5">
              <Input
                label={
                  <>
                    <span>Job Title</span>
                    <span className="text-red-600 ml-1">*</span>
                  </>
                }
                placeholder="e.g. Frontend Developer"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <TwoCol>
                <JobSelect
                  label="Job Type"
                  value={form.jobType}
                  options={[
                    { _id: "Remote", name: "Remote" },
                    { _id: "Full-Time", name: "Full-Time" },
                    { _id: "Part-Time", name: "Part-Time" },
                    { _id: "Hybrid", name: "Hybrid" },
                  ]}
                  onChange={(v: string) => setForm({ ...form, jobType: v })}
                />

                <Input
                  label={
                    <>
                      <span>Experience Level (minimum required)</span>
                      <span className="text-red-600 ml-1">*</span>
                    </>
                  }
                  type="number"
                  placeholder="e.g. 2"
                  value={form.requiredExperience.toString()}
                  onChange={(v) =>
                    setForm({ ...form, requiredExperience: Number(v) })
                  }
                />
              </TwoCol>

              <TwoCol>
                <Input
                  label={
                    <>
                      <span>Application Deadline</span>
                      <span className="text-red-600 ml-1">*</span>
                    </>
                  }
                  placeholder="Select last date"
                  type="date"
                  min={today}
                  value={form.expiry}
                  onChange={(v) => setForm({ ...form, expiry: v })}
                />

                <div>
                  <Input
                    label={
                      <>
                        <span>Pincode</span>
                        <span className="text-red-600 ml-1">*</span>
                      </>
                    }
                    placeholder="e.g. 462001"
                    value={form.location.pincode}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        location: { ...form.location, pincode: v },
                      })
                    }
                  />

                  {pincodeStatus.message && (
                    <p
                      className={`text-xs mt-1 ${pincodeStatus.type === "error"
                        ? "text-red-600"
                        : "text-blue-600"
                        }`}
                    >
                      {pincodeStatus.loading && (
                        <span className="inline-block w-3 h-3 mr-1 border-2 border-current border-t-transparent rounded-full animate-spin align-middle" />
                      )}
                      {pincodeStatus.message}
                    </p>
                  )}
                </div>
              </TwoCol>

              <TwoCol>
                <Input
                  label="City"
                  placeholder="e.g. Bhopal"
                  value={form.location.city}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      location: { ...form.location, city: v },
                    })
                  }
                />
                <Input
                  label="State"
                  placeholder="e.g. Madhya Pradesh"
                  value={form.location.state}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      location: { ...form.location, state: v },
                    })
                  }
                />
              </TwoCol>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label={
                    <>
                      <span>Education</span>
                      <span className="text-red-600 ml-1">*</span>
                    </>
                  }
                  placeholder="e.g. B.Tech / BCA / MCA"
                  value={form.education}
                  onChange={(v) => setForm({ ...form, education: v })}
                />

                <Input
                  label={
                    <>
                      <span>Min Salary (INR)</span>
                      <span className="text-red-600 ml-1">*</span>
                    </>
                  }
                  placeholder="e.g. 15000"
                  type="number"
                  value={form.salary.min.toString()}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      salary: { ...form.salary, min: Number(v) },
                    })
                  }
                />

                <Input
                  label={
                    <>
                      <span>Max Salary (INR)</span>
                      <span className="text-red-600 ml-1">*</span>
                    </>
                  }
                  placeholder="e.g. 30000"
                  type="number"
                  value={form.salary.max.toString()}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      salary: { ...form.salary, max: Number(v) },
                    })
                  }
                />
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">
                  Required Skills <span className="text-red-600 ml-1">*</span>
                </label>

                <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 items-center">
                  {form.skills.map((s) => (
                    <span
                      key={s._id}
                      className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-700 border rounded-full text-xs font-semibold cursor-pointer"
                      onClick={() =>
                        setForm({
                          ...form,
                          skills: form.skills.filter((x) => x._id !== s._id),
                        })
                      }
                    >
                      {s.name}
                      <span className="text-gray-400 hover:text-red-500">
                        ✕
                      </span>
                    </span>
                  ))}

                  <input
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                    placeholder="Type to search skills..."
                    className="flex-grow min-w-[140px] bg-transparent outline-none text-sm"
                  />
                </div>

                {skillQuery && (
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(
                        (s: Skill) =>
                          s.name
                            .toLowerCase()
                            .includes(skillQuery.toLowerCase()) &&
                          !form.skills.some((x) => x._id === s._id),
                      )
                      .slice(0, 8)
                      .map((s: Skill) => (
                        <button
                          key={s._id}
                          onClick={() => {
                            setForm({ ...form, skills: [...form.skills, s] });
                            setSkillQuery("");
                          }}
                          className="px-3 py-1 text-xs rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 transition cursor-pointer"
                        >
                          + {s.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <JobSelect
                label={
                  <>
                    <span>Job Category</span>
                    <span className="text-red-600 ml-1">*</span>
                  </>
                }
                value={form.category}
                options={categories}
                onChange={(v) => setForm({ ...form, category: v })}
                onLoadMore={() => {
                  if (categoriesHasNext && !isFetchingMoreCategories)
                    fetchMoreCategories();
                }}
                hasMore={!!categoriesHasNext}
                isLoadingMore={!!isFetchingMoreCategories}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">
                  <span>Job Description</span>
                  <span className="text-red-600 ml-1">*</span>
                </label>

                <JobDescriptionEditor
                  value={form.description}
                  onChange={(html: string) =>
                    setForm({
                      ...form,
                      description: html,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-4 ml-auto">
              <button
                type="button"
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setForm(initialForm);
                  if (onClose) onClose();
                  else router.back();
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitJob}
                disabled={isPending}
                className="px-8 py-3 bg-[#2b4bee] text-white rounded-lg font-semibold shadow-md shadow-[#2b4bee]/30 hover:bg-[#2340c8] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? "Creating..." : "Next Screening Questions"}
                {!isPending && <span>→</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= Helpers ================= */
function Input({
  label,
  value = "",
  onChange,
  type = "text",
  ...props
}: {
  label: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
        className="px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
      />
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}