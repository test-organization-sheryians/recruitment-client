import { useState } from "react";
import { ExperienceItem } from "../../../types/ExperienceItem ";

import {
  useCreateExperience,
  useGetCandidateExperience,
  useDeleteExperience,
  useUpdateExperience,
} from "../../../features/candidate/experience/hooks/useExperienceApi";


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
  });

  const deleteExperience = useDeleteExperience();

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
      setEditingId(null);
    },
  });

  const { data, isLoading } = useGetCandidateExperience(candidateId);
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
    if (!form.company || !form.title) return;

    if (editingId) {
      updateExperience.mutate({
        id: editingId,
        company: form.company,
        title: form.title,
        location: form.location,
        startDate: form.startDate,
        endDate: form.isCurrent ? undefined : form.endDate,
        isCurrent: form.isCurrent,
        description: form.description,
      });
    } else {
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
    <div className="bg-white rounded-2xl p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        {editingId && (
          <span className="text-sm text-blue-600 font-medium">
            Editing Mode
          </span>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border space-y-4">
        <h3 className="font-medium text-gray-700">
          {editingId ? "Update Experience" : "Add New Experience"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="input"
          />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="input"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="input"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input"
            />
            {!form.isCurrent && (
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="input"
              />
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={handleCheckbox}
          />
          Currently Working Here
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description"
          rows={3}
          className="input resize-none"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
        >
          {editingId ? "Update Experience" : "Add Experience"}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          Experience History
        </h3>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 text-sm">No experience added yet.</p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp._id}
              className="border rounded-xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-sm text-gray-600">
                    {exp.company} • {exp.location}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!exp._id) return;
                      setEditingId(exp._id);
                    setForm({
  company: exp.company,
  title: exp.title,
  location: exp.location || "",
  startDate:
    exp.startDate instanceof Date
      ? exp.startDate.toISOString().slice(0, 10)
      : exp.startDate || "",
  endDate:
    exp.endDate instanceof Date
      ? exp.endDate.toISOString().slice(0, 10)
      : exp.endDate || "",
  isCurrent: exp.isCurrent || false,
  description: exp.description || "",
});

                    }}
                    className="px-2 py-1 border rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      exp._id &&
                      candidateId &&
                      deleteExperience.mutate({
                        id: exp._id,
                        candidateId,
                      })
                    }
                    className="px-2 py-1 border rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="text-sm text-gray-700 mt-2">
                  {exp.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
