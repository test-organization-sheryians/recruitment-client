import { useState } from "react";
import { ExperienceItem } from "@/types/ExperienceItem ";

interface Props {
  onAdd?: (experience: ExperienceItem) => void; // <-- made optional
  experience?: ExperienceItem[]; // <-- optional for safety
}

export default function ExperienceSection({ onAdd, experience = [] }: Props) {
  const [form, setForm] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = () => {
    setForm((prev) => ({ ...prev, isCurrent: !prev.isCurrent, endDate: "" }));
  };

  const handleSubmit = () => {
    if (!form.company || !form.title || !onAdd) return;

    const newExp: ExperienceItem = {
      _id: crypto.randomUUID(),
      ...form,
    };

    onAdd(newExp);

    setForm({
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Experience</h2>

      {/* ---- FORM UI (unchanged) ---- */}
      <div className="grid gap-4">
        <label className="sr-only" htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="input"
        />

        <label className="sr-only" htmlFor="title">Job Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="input"
        />

        <label className="sr-only" htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="input"
        />

        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="input !w-1/2"
          />

          {!form.isCurrent && (
            <>
              <label className="sr-only" htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="input !w-1/2"
              />
            </>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isCurrent} onChange={handleCheckbox} />
          Currently Working Here
        </label>

        <label className="sr-only" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={3}
          className="input"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-medium"
        >
          Add Experience
        </button>
      </div>

      {/* ---- LIST UI (unchanged) ---- */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">Your Experience</h3>

        {experience.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No experience added yet.</p>
        ) : (
          <ul className="space-y-4">
            {experience.map((exp) => (
              <li key={exp._id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">{exp.company}</p>
                  <span className="text-xs text-gray-500">
                    {exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString()
                      : ""}{" "}
                    -{" "}
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <p className="text-sm">{exp.title}</p>
                <p className="text-xs text-gray-600">{exp.location}</p>

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
