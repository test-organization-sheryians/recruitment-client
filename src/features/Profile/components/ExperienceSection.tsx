"use client";
import { useState } from "react";
import { ExperienceItem } from "@/types/ExperienceItem ";
import {
  useCreateExperience,
  useGetCandidateExperience,
  useDeleteExperience,
  useUpdateExperience
} from "@/features/experience/hooks/useExperienceApi";
import { FaPlus } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Modal from "@/components/ui/Modal";

interface Props {
  candidateId?: string;
}

export default function ExperienceSection({ candidateId }: Props) {

  const [experienceModal, setExperienceModal] = useState(false);

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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => console.error("Failed to update experience:", error),
  });

  const isModal = () => setExperienceModal(!experienceModal);


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
    <div className="bg-white rounded-2xl p-2  space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

        <h2 className="text-xl font-bold text-gray-800">
          Experience
        </h2>

        <button onClick={isModal}>
          <FaPlus />
        </button>
        {editingId && (
          <span className="text-sm text-blue-600 font-medium">
            Editing Mode
          </span>
        )}
      </div>

      {/* FORM CARD */}
    <Modal isOpen={experienceModal} onClose={isModal}  title="Add Experiences" >
        <div className="bg-gray-50 rounded-xl p-5 border space-y-4">
          <h3 className="font-medium text-gray-700">
            {editingId ? "Update Experience" : "Add New Experience"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="input"
            />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="input"
            />
            <input
              type="text"
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
                className="input w-full"
              />

              {!form.isCurrent && (
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="input w-full"
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
            placeholder="Brief description of your role"
            rows={3}
            className="input resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={createExperience.isPending}
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            {createExperience.isPending
              ? "Saving..."
              : editingId
                ? "Update Experience"
                : "Add Experience"}
          </button>
        </div>
    </Modal>

      {/* EXPERIENCE LIST */}
      <div className="space-y-4 ">
        <h3 className="text-lg font-bold  text-gray-800">
          Experience History
        </h3>

        {isLoading ? (
          <p className="text-gray-500 text-sm italic">Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No experience added yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-50 overflow-y-auto">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-white border border-2 border-zinc-200 shadow-md rounded-xl p-5 shadow-[0_2px_12px_rgba(59,130,246,0.08)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.12)] transition"

              >

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {exp.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString()} –{" "}
                      {exp.isCurrent
                        ? "Present"
                        : exp.endDate &&
                        new Date(exp.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {/* EDIT - Pencil */}
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
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l10.4-10.4a1 1 0 000-1.414l-3.586-3.586a1 1 0 00-1.414 0l-10.4 10.4A1 1 0 004 15.414V20z"
                        />
                      </svg>
                    </button>

                    {/* DELETE - Dustbin */}
                    <button
                      onClick={() => {
                        if (!exp._id || !candidateId) return;
                        deleteExperience.mutate({
                          id: exp._id,
                          candidateId: candidateId,
                        });
                      }}
                      disabled={deleteExperience.isPending}
                      className="p-3 sm:p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                        />
                      </svg>
                    </button>
                  </div>

                </div>

                {exp.description && (
                  <p className="text-sm text-gray-700 mt-3">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
