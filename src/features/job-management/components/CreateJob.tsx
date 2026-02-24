"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { createJob } from "../hooks/jobs.api";
import { useGetCategories } from "../hooks/useJobApi";

import JobDescriptionEditor from "./JobDescriptionEditor";
import { Briefcase } from "lucide-react";
import { usePincodeLookup } from "../hooks/usePincodeLookup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // ✅ ADDED

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
  clientId: string; // ✅ ADD
};

type CreateJobPayload = Omit<CreateJobFormValues, "skills"> & {
  skills: string[];
};

/* ================= API ================= */

const fetchSkills = async (): Promise<Skill[]> => {
  const res = await apiClient.get("/skills");
  return res.data.data;
};

const today = new Date().toISOString().split("T")[0];

/* ================= COMPONENT ================= */

export default function CreateJob({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter();

  const [skillQuery, setSkillQuery] = React.useState("");

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

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

  const [form, setForm] = React.useState<CreateJobFormValues>(initialForm);

  const pincodeStatus = usePincodeLookup(form.location.pincode, (location) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        ...location,
      },
    }));
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createJob,

    onSuccess: (res) => {
      toast.dismiss(); // ✅ remove loading if any

      const jobId = res?.data?.data?._id;

      if (!jobId) {
        toast.error("Job created but Job ID not found");
        return;
      }

      toast.success("Job created successfully 🚀");

      // ✅ small delay so toast is visible
      setTimeout(() => {
        router.push(`/admin/screen/${jobId}`);
      }, 800);
    },

    onError: (error: any) => {
      toast.dismiss(); // ✅ remove loading if any
      const message = error?.response?.data?.message || "Failed to create job";
      toast.error(message);
    },
  });

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

    mutate({
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
    } as CreateJobPayload);
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
                <Select
                  label="Job Type"
                  value={form.jobType}
                  options={[
                    { _id: "Remote", name: "Remote" },
                    { _id: "Full-Time", name: "Full-Time" },
                    { _id: "Part-Time", name: "Part-Time" },
                    { _id: "Hybrid", name: "Hybrid" },
                  ]}
                  onChange={(v) => setForm({ ...form, jobType: v })}
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
                      className={`text-xs mt-1 ${
                        pincodeStatus.type === "error"
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
                        (s) =>
                          s.name
                            .toLowerCase()
                            .includes(skillQuery.toLowerCase()) &&
                          !form.skills.some((x) => x._id === s._id),
                      )
                      .slice(0, 8)
                      .map((s) => (
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

              <Select
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
                  onChange={(html) =>
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
            {/* <button
              type="button"
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
              onClick={() => {
                toast("Draft save coming soon 🙂");
              }}
            >
              Save Draft
            </button> */}

            <div className="flex items-center gap-4">
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

type SelectProps = {
  label: React.ReactNode;
  value: string;
  options: Category[];
  onChange: (v: string) => void;

  // infinite scroll props
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

function Select({
  label,
  value,
  options,
  onChange,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: {
  label: React.ReactNode;
  value: string;
  options: Category[];
  onChange: (v: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}) {
  // allow optional infinite-loading props when provided
  // @ts-ignore
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o._id === value);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-bold">{label}</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-left shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <span className={`${selected ? "" : "text-gray-400"}`}>
            {selected ? selected.name : "Select"}
          </span>

          <svg
            className={`w-4 h-4 ml-2 transform transition ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            onScroll={(e) => {
              const target = e.currentTarget;
              if (!onLoadMore || !hasMore) return;
              if (
                target.scrollTop + target.clientHeight >=
                target.scrollHeight - 8
              ) {
                if (!isLoadingMore) onLoadMore();
              }
            }}
            className="absolute z-40 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border shadow-lg max-h-48 overflow-auto"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${!value ? "font-semibold" : "text-gray-600 dark:text-gray-200"} cursor-pointer`}
              >
                Select
              </button>
            </li>
            {options.map((c) => (
              <li key={c._id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c._id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${value === c._id ? "bg-[#2b4bee] text-white" : "text-gray-700 dark:text-gray-200"} cursor-pointer`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}
