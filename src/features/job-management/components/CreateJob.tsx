"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
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
};


/* ================= API ================= */



const fetchSkills = async (): Promise<Skill[]> => {
  const res = await apiClient.get("/skills");
  return res.data.data;
};

const fetchCategories = async () => {
  const res = await apiClient.get("/job-categories");
  return res.data.data;
};


const createJob = async (payload: any) => {
  const res = await apiClient.post("/jobs", payload);
  return res.data;
};

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

  const mutation = useMutation({ mutationFn: createJob });



  const [form, setForm] = React.useState<CreateJobFormValues>({
  title: "",
  requiredExperience: "",
  category: "",
  education: "",
  jobType: "",
  description: "",
  expiry: "",
  skills: [],
  salary: {
    min: 0,
    max: 0,
  },
  location: {
    city: "",
    state: "",
    country: "India",
    pincode: "",
  },
});

  const submitJob = () => {
   mutation.mutate({
  title: form.title,
  requiredExperience: form.requiredExperience,
  category: form.category,
  education: form.education,
  jobType: form.jobType,
  description: form.description,
  expiry: form.expiry,
  skills: form.skills.map((s) => s._id),
  salary: form.salary,
  location: form.location,
});

  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111218] dark:text-white min-h-screen">

   
   

      {/* ================= Main ================= */}
      <main className="flex flex-col items-center py-12 px-4 sm:px-10">
        <div className="max-w-[800px] w-full flex flex-col gap-10">

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
          <section className="bg-white dark:bg-[#1a1e2e] rounded-xl border border-[#dbdde6] dark:border-gray-800 p-6 md:p-8 shadow-sm">

            <h3 className="text-lg font-bold mb-8">Job Details</h3>

            <Input
              label="Job Title"
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
                value={form.requiredExperience}
                onChange={(v) => setForm({ ...form, requiredExperience: v })}
              />
            </TwoCol>

            <TwoCol>
              <Input
                label="Application Deadline"
                type="date"
                value={form.expiry}
                onChange={(v) => setForm({ ...form, expiry: v })}
              />
              <Input
                label="City"
                value={form.location.city}
                onChange={(v) =>
                  setForm({
                    ...form,
                    location: { ...form.location, city: v },
                  })
                }
              />
            </TwoCol>

            <TwoCol>
              <Input
                label="State"
                value={form.location.state}
                onChange={(v) =>
                  setForm({
                    ...form,
                    location: { ...form.location, state: v },
                  })
                }
              />
              <Input
                label="Pincode"
                value={form.location.pincode}
                onChange={(v) =>
                  setForm({
                    ...form,
                    location: { ...form.location, pincode: v },
                  })
                }
              />
            </TwoCol>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Input
    label="Education"
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
        {/* ================= Skills ================= */}
<div className="flex flex-col gap-2">
  <label className="text-sm font-bold">Required Skills</label>

  {/* Selected Skills */}
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

  {/* Suggestions */}
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
            className="px-3 py-1 text-xs rounded-full border border-dashed border-primary
                       text-primary hover:bg-primary/10 transition"
          >
            + {s.name}
          </button>
        ))}
    </div>
  )}
</div>


<div className="mt-6">
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
</div>



<JobDescriptionEditor
  value={form.description}
  onChange={(html) =>
    setForm({
      ...form,
      description: html,
    })
  }
/>


          </section>

          {/* Footer */}
          <div className="flex justify-end">
           <button
  onClick={submitJob}
  className="
    px-10 py-3
    bg-[#2b4bee]
    text-white
    rounded-lg
    font-bold
    shadow-lg shadow-[#2b4bee]/20
    transition-shadow
  "
>
  Next: Screening Questions →
</button>

          </div>

        </div>
      </main>
    </div>
  );
}

/* ================= Helpers ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

