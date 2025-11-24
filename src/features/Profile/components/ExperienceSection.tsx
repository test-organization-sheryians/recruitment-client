"use client";
import { useState } from "react";
import { ExperienceItem } from "@/types/ExperienceItem ";
import {
  useCreateExperience,
  useGetCandidateExperience,
  useDeleteExperience,
  useUpdateExperience
} from "@/features/experience/hooks/useExperienceApi";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  candidateId?: string;
}

export default function ExperienceSection({ candidateId }: Props) {
  const [form, setForm] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);


  const createExperience = useCreateExperience({
  onSuccess: () => {
    setForm({
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
  },
  onError: (error) => {
    console.error("Failed to create experience:", error);
  }
});
const deleteExperience = useDeleteExperience({
  onError: (error: any) => {
    console.error("Failed to delete experience:", error);
  }
});
const updateExperience = useUpdateExperience({
  onSuccess: () => {
    setForm({
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setEditingId(null); // reset editing state
  },
  onError: (error:any) => console.error("Failed to update experience:", error),
});



const { data, isLoading } = useGetCandidateExperience(candidateId);
  console.log("Experience API Raw:", data);
  console.log("Parsed Experiences:", data?.data);
const experiences: ExperienceItem[] = data?.data ?? [];


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = () => {
    setForm((prev) => ({
      ...prev,
      isCurrent: !prev.isCurrent,
      endDate: "",
    }));
  };

const handleSubmit = () => {
  if (!form.company || !form.title) {
    console.error("Missing required fields");
    return;
  }

  if (editingId) {
    // UPDATE existing experience
    updateExperience.mutate({
      id: editingId, // goes in URL
      company: form.company,
      title: form.title,
      location: form.location,
      startDate: form.startDate,
      endDate: form.isCurrent ? undefined : form.endDate,
      isCurrent: form.isCurrent,
      description: form.description,
    });
  } else {
    // CREATE new experience — remove candidateId
    createExperience.mutate({
      company: form.company,
      title: form.title,
      location: form.location,
      startDate: form.startDate,
      endDate: form.isCurrent ? undefined : form.endDate,
      isCurrent: form.isCurrent,
      description: form.description,
    });
  }
};




  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Add Experience
      </h2>

      {/* FORM UI */}
      <div className="grid gap-4">
        <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company Name" className="input" />
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Job Title" className="input" />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input" />

        <div className="flex items-center gap-3">
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input !w-1/2" />

          {!form.isCurrent && (
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input !w-1/2" />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isCurrent} onChange={handleCheckbox} />
          Currently Working Here
        </label>

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description (optional)" rows={3} className="input" />

        <button
          onClick={handleSubmit}
          disabled={createExperience.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-medium"
        >
          {createExperience.isPending ? "Saving..." : "Add Experience"}
        </button>
      </div>

      {/* LIST UI */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">Your Experience</h3>

        {isLoading ? (
          <p className="text-gray-500 text-sm italic">Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No experience added yet.</p>
        ) : (
          <ul className="space-y-4">
            {experiences.map((exp) => (
              <li key={exp._id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
  <div className="flex justify-between items-start">
    <div>
      <p className="font-semibold">{exp.company}</p>
      <p className="text-sm">{exp.title}</p>
      <p className="text-xs text-gray-600">{exp.location}</p>
    </div>

    <button
  onClick={() => {
    if (!exp._id || !candidateId) return;

    deleteExperience.mutate({
      id: exp._id,
      candidateId: candidateId,
    });
  }}
  disabled={deleteExperience.isPending}
  className="text-red-600 hover:text-red-800 text-sm font-medium"
>
  Delete
</button>

<button
  onClick={() => {
    if (!exp._id) return;

    setEditingId(exp._id);
    setForm({
      company: exp.company,
      title: exp.title,
      location: exp.location || "",
      startDate: exp.startDate instanceof Date
        ? exp.startDate.toISOString().slice(0, 10)
        : exp.startDate,
      endDate: exp.endDate
        ? exp.endDate instanceof Date
          ? exp.endDate.toISOString().slice(0, 10)
          : exp.endDate
        : "",
      isCurrent: exp.isCurrent || false,
      description: exp.description || "",
    });
  }}
  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
>
  Edit
</button>


  </div>

  <span className="text-xs text-gray-500 block mt-1">
    {exp.startDate && new Date(exp.startDate).toLocaleDateString()} -{" "}
    {exp.isCurrent ? "Present" : exp.endDate && new Date(exp.endDate).toLocaleDateString()}
  </span>

  {exp.description && (
    <p className="text-xs text-gray-700 mt-2">{exp.description}</p>
  )}
</li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
