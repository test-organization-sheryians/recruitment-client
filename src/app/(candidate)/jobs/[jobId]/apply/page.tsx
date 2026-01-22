"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Question = {
  _id: string;
  title: string;
  inputType: "text" | "number" | "textarea" | "dropdown";
  description?: string;
  options?: string[];
  isRequired: boolean;
  placeholder?: string;
  maxLength?: number;
};

/* ================= JSON DATA ================= */

const QUESTIONS: Question[] = [
  {
    _id: "1",
    title: "Full Name",
    inputType: "text",
    isRequired: true,
    placeholder: "Enter your full name",
    maxLength: 100,
  },
  {
    _id: "2",
    title: "Email Address",
    inputType: "text",
    description: "We will use this to contact you",
    isRequired: true,
    placeholder: "you@example.com",
  },
  {
    _id: "3",
    title: "Phone Number",
    inputType: "number",
    isRequired: true,
    placeholder: "Enter phone number",
  },
  {
    _id: "4",
    title: "Why do you want this role?",
    inputType: "textarea",
    isRequired: true,
    placeholder: "Write your answer...",
    maxLength: 500,
  },
  {
    _id: "5",
    title: "Experience",
    inputType: "dropdown",
    isRequired: true,
    options: ["0-1 years", "2-4 years", "5-7 years", "8+ years"],
  },
];

/* ================= PAGE ================= */

export default function ApplyPage({ params }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");

  /* ---------- handle input change ---------- */
  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /* ---------- submit ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // required validation
    for (const q of QUESTIONS) {
      if (q.isRequired && !formData[q._id]) {
        setError(`${q.title} is required`);
        return;
      }
    }

    setError("");

    console.log("FORM DATA 👉", formData);

    // test purpose
    localStorage.setItem(
      `job-apply-${params.jobId}`,
      JSON.stringify(formData)
    );

    alert("Form submitted successfully!");

    // next step (optional)
    // router.push("/success");
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Job Application Form
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {QUESTIONS.map((q) => (
          <div key={q._id}>
            <label className="block font-medium mb-1">
              {q.title}
              {q.isRequired && (
                <span className="text-red-500"> *</span>
              )}
            </label>

            {q.description && (
              <p className="text-sm text-gray-500 mb-2">
                {q.description}
              </p>
            )}

            {q.inputType === "text" && (
              <input
                type="text"
                placeholder={q.placeholder}
                maxLength={q.maxLength}
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
              />
            )}

            {q.inputType === "number" && (
              <input
                type="number"
                placeholder={q.placeholder}
                className="w-full border px-3 py-2 rounded   appearance-none 
               [&::-webkit-outer-spin-button]:appearance-none 
               [&::-webkit-inner-spin-button]:appearance-none 
               [moz-appearance:textfield]"
                 min="0"
                 onKeyDown={(e) => {
                 if (e.key === "-" || e.key === "e") {
                 e.preventDefault();
                 }
             
                }}

                
               onChange={(e) => {
               const value = e.target.value.replace(/\D/g, "");
               if (value.length <= 10) {
               handleChange(q._id, value);
                }
            }}
              />
            )}

            {q.inputType === "textarea" && (
              <textarea
                rows={4}
                placeholder={q.placeholder}
                maxLength={q.maxLength}
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
              />
            )}

            {q.inputType === "dropdown" && (
              <select
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
              >
                <option value="">Select</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

