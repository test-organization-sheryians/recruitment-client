"use client";
import { useApplyJob } from "@/features/applyJobs/hooks/useApplyJob";
import { useGetProfile } from "@/features/candidate/Profile/hooks/useProfileApi";
import { useParams } from "next/navigation";
import { useState } from "react";



type Question = {
  _id: string;
  title: string;
  inputType: string;
  description?: string;
  options: string[];
  isRequired: boolean;
  placeholder?: string;
  maxLength?: number | null;
};

const QUESTIONS: Question[] = [
  {
    _id: "65a7f1c9b12e9c0012345678",
    title: "Full Name",
    inputType: "text",
    options: [],
    isRequired: false,
    placeholder: "Enter your full name",
    maxLength: 100,
  },
  {
    _id: "65a7f1cab12e9c0012345679",
    title: "Email Address",
    inputType: "text",
    description: "We will use this to contact you.",
    options: [],
    isRequired: true,
    placeholder: "you@example.com",
    maxLength: 150,
  },
  {
    _id: "65a7f1cbb12e9c0012345680",
    title: "Phone Number",
    inputType: "number",
    options: [],
    isRequired: true,
    placeholder: "Enter your phone number",
  },
  {
    _id: "65a7f1ccb12e9c0012345681",
    title: "Why do you want this role?",
    inputType: "textarea",
    description: "Briefly explain your motivation.",
    options: [],
    isRequired: true,
    placeholder: "Your answer here...",
    maxLength: 500,
  },
  {
    _id: "65a7f1cdb12e9c0012345682",
    title: "How many years of relevant experience do you have?",
    inputType: "dropdown",
    options: ["0-1 years", "2-4 years", "5-7 years", "8+ years"],
    isRequired: true,
  },
];

export default function ApplyPage() {

const applyJobMutation = useApplyJob();
const { jobId } = useParams<{ jobId: string }>();
 const { data: profile } = useGetProfile();
 const [answers, setAnswers] = useState<{ [key: string]: string }>({});

 const handleChange = (id: string, value: string) => {
  setAnswers((prev) => ({
    ...prev,
    [id]: value,
  }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
console.log("JOB ID:", jobId);
console.log("RESUME:", profile?.resumeFile);
console.log("ANSWERS:", answers);

  applyJobMutation.mutate({
    jobId, // ya params se aane wala jobId
    message: JSON.stringify(answers), // form answerssn
    resumeUrl: profile?.resumeFile,   // candidate resume
  });
};



  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Job Application Form
      </h1>

      <form className="space-y-6"  onSubmit={handleSubmit}>
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
                maxLength={q.maxLength ?? undefined}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            )}

            {q.inputType === "number" && (
              <input
                type="number"
                placeholder={q.placeholder}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            )}

            {q.inputType === "textarea" && (
              <textarea
                placeholder={q.placeholder}
                maxLength={q.maxLength ?? undefined}
                className="w-full border px-3 py-2 rounded"
                onChange={(e) => handleChange(q._id, e.target.value)}
                rows={4}
              />
            )}

            {q.inputType === "dropdown" && (
              <select 
              className="w-full border px-3 py-2 rounded"
              onChange={(e) => handleChange(q._id, e.target.value)}
              >
              
                <option value="">Select</option>
                {q.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

            )}
          </div>
        ))}

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
