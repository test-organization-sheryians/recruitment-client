"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { createJob } from "../hooks/jobs.api";

import JobDescriptionEditor from "./JobDescriptionEditor";
import { Briefcase } from "lucide-react";
import { usePincodeLookup } from "../hooks/usePincodeLookup";
import { useRouter } from "next/navigation";






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
  requiredExperience: string;
  category: string;
  education: string;
  jobType: string;
  description: string;
  expiry: string;
  skills: Skill[];
  salary: {
    min: number;
    max: number;
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

const fetchCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get("/job-categories");
  return res.data.data;
};

const today = new Date().toISOString().split("T")[0];





/* ================= COMPONENT ================= */

export default function CreateJob() {

  const [skillQuery, setSkillQuery] = React.useState("");
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

const { mutate, isPending } = useMutation({
  mutationFn: createJob,

  onSuccess: (res) => {
    // backend se job id nikaalo
    const jobId = res?.data?.data?._id;

    if (!jobId) {
      alert("Job created but Job ID not found");
      return;
    }

    // ✅ NEXT PAGE REDIRECT
    router.push(`/Crew/${jobId}/screen`);
  },

  onError: () => {
    alert("Failed to create job");
  },
});


const router = useRouter();




const [form, setForm] = React.useState<CreateJobFormValues>({
  title: "",
  requiredExperience: "",
  category: "",
  education: "",
  jobType: "Full-Time", // ✅ default (backend expects this)
  description: "",
  expiry: "",
  skills: [],

  salary: {
    min: 0, // ✅ backend-safe default
    max: 0, // ✅ backend-safe default
  },

  location: {
    city: "",
    state: "",
    pincode: "",
    country: "India", // ✅ same as JobForm
  },

  clientId: "6915b90df6594de75060410b", // ✅ REQUIRED by backend
});

const pincodeStatus = usePincodeLookup(
  form.location.pincode,
  (location) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        ...location,
      },
    }));
  }
);

const submitJob = () => {

    const today = new Date();
today.setHours(0, 0, 0, 0);

if (!form.expiry) {
  alert("Please select an application deadline");
  return;
}

const selectedDate = new Date(form.expiry);
if (selectedDate < today) {
  alert("Application deadline cannot be in the past");
  return;
}

  // basic validation (JobForm jaisa)
  if (
    !form.title ||
    !form.description ||
    !form.education ||
    !form.requiredExperience ||
    !form.expiry ||
    !form.category ||
    form.skills.length === 0
  ) {
    alert("Please fill all required fields");
    return;
  }

  mutate({
    title: form.title,
    description: form.description,
    education: form.education,
    requiredExperience: form.requiredExperience,
    expiry: form.expiry,
    category: form.category,

    skills: form.skills.map((s) => s._id), // ✅ IDs only

    jobType: form.jobType || "Full-Time",

    salary: {
      min: form.salary.min,
      max: form.salary.max,
    },

    location: {
      city: form.location.city,
      state: form.location.state,
      pincode: form.location.pincode,
      country: form.location.country || "India",
    },

    clientId: form.clientId, // ✅ REQUIRED
  });
};




  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111218] dark:text-white min-h-screen">




      {/* ================= Main ================= */}
      <main className="flex flex-col items-center py-12 px-4 sm:px-10">
        <div className="max-w-200 w-full flex flex-col gap-10">

          {/* Title */}
          <div>
            <button className="text-sm text-gray-500 mb-2">
              ← Back to Jobs
            </button>
            <h1 className="text-3xl font-black">Create New Job</h1>
            <p className="text-gray-500">
              Fill in the details below to post a new job opening.
            </p>
          </div>

          {/* ================= Form Card ================= */}
      <section className="p-0 border-none bg-transparent shadow-none">

  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
      <Briefcase size={14} className="text-blue-600" />
    </div>
    <h3 className="text-lg font-bold">Job Details</h3>
  </div>

  {/* FORM CONTENT WRAPPER */}
  <div className="flex flex-col gap-5">

    <Input
      label="Job Title"
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
        label="Experience Level"
        placeholder="e.g. 1–3 years"
        value={form.requiredExperience}
        onChange={(v) => setForm({ ...form, requiredExperience: v })}
      />
    </TwoCol>

  <TwoCol>
<Input
  label="Application Deadline"
  placeholder="Select last date"
  type="date"
  min={today}                
  value={form.expiry}
  onChange={(v) => setForm({ ...form, expiry: v })}
/>


  <div>
    <Input
      label="Pincode"
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
        label="Education"
         placeholder="e.g. B.Tech / BCA / MCA"
        value={form.education}
        onChange={(v) =>
          setForm({
            ...form,
            education: v,
          })
        }
      />

      <Input
        label="Min Salary (INR)"
          placeholder="e.g. 15000"

        type="number"
        value={form.salary.min.toString()}
        onChange={(v) =>
          setForm({
            ...form,
            salary: {
              ...form.salary,
              min: Number(v),
            },
          })
        }
      />

      <Input
        label="Max Salary (INR)"
         placeholder="e.g. 30000"
        type="number"
        value={form.salary.max.toString()}
        onChange={(v) =>
          setForm({
            ...form,
            salary: {
              ...form.salary,
              max: Number(v),
            },
          })
        }
      />
    </div>

    {/* Skills */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold">Required Skills</label>

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
            <span className="text-gray-400 hover:text-red-500">✕</span>
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
                s.name.toLowerCase().includes(skillQuery.toLowerCase()) &&
                !form.skills.some((x) => x._id === s._id)
            )
            .slice(0, 8)
            .map((s) => (
              <button
                key={s._id}
                onClick={() => {
                  setForm({ ...form, skills: [...form.skills, s] });
                  setSkillQuery("");
                }}
                className="px-3 py-1 text-xs rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 transition"
              >
                + {s.name}
              </button>
            ))}
        </div>
      )}
    </div>

    <Select
      label="Job Category"
      value={form.category}
      options={categories}
      onChange={(v) =>
        setForm({
          ...form,
          category: v,
        })
      }
    />

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
</section>


          {/* Footer */}
          <div className="flex items-center justify-between mt-10">
            {/* Left: Save Draft */}
            <button
              type="button"
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
              onClick={() => {
                // TODO: save draft logic later
                console.log("Save Draft");
              }}
            >
              Save Draft
            </button>

            {/* Right: Cancel + Next */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="
        px-6 py-3
        rounded-lg
        border
        border-gray-300
        bg-white
        text-gray-700
        font-semibold
        hover:bg-gray-50
        transition
      "
                onClick={() => {
                  // TODO: navigate back / reset form
                  console.log("Cancel");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitJob}
                disabled={isPending}
                className="
        px-8 py-3
        bg-[#2b4bee]
        text-white
        rounded-lg
        font-semibold
        shadow-md shadow-[#2b4bee]/30
        hover:bg-[#2340c8]
        transition
        flex items-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
      "
              >
                {isPending ? 'Creating...' : 'Next Screening Questions'}
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
  label: string;
  value?: string;          // 🔥 optional
  onChange?: (v: string) => void; // 🔥 optional
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


function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Category[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
      >
        <option value="">Select</option>
        {options.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

