"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { LoaderCircleIcon } from "lucide-react";

import {
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "@/features/candidate/experience/hooks/useExperienceApi";
import { ExperienceItem } from "@/types/ExperienceItem ";

interface Props {
  candidateId: string;
  experiences: ExperienceItem[]; // ← From parent
  refetchProfile?: () => void; // ← Trigger parent refetch
}

export default function ExperienceSection({
  candidateId,
  experiences,
  refetchProfile,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  // Only mutations — no query!
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentJob = () => {
    setForm((prev) => ({
      ...prev,
      isCurrent: !prev.isCurrent,
      endDate: !prev.isCurrent ? "" : prev.endDate,
    }));
  };

  const handleSubmit = () => {
    if (!form.company || !form.title || !form.startDate) return;

    const payload = {
      candidateId,
      company: form.company.trim(),
      title: form.title.trim(),
      location: form.location.trim() || undefined,
      startDate: form.startDate,
      endDate: form.isCurrent ? undefined : form.endDate || undefined,
      isCurrent: form.isCurrent,
      description: form.description.trim() || undefined,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, ...payload },
        {
          onSuccess: () => {
            closeModal();
            refetchProfile?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          closeModal();
          refetchProfile?.();
        },
      });
    }
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingId(exp._id || null);

    setForm({
      company: exp.company || "",
      title: exp.title || "",
      location: exp.location || "",
      description: exp.description || "",
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().slice(0, 10)
        : "",

      endDate:
        exp.endDate && !exp.isCurrent
          ? new Date(exp.endDate).toISOString().slice(0, 10)
          : "",

      isCurrent: !!exp.isCurrent,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id, candidateId },
      {
        onSuccess: () => refetchProfile?.(),
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6 shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        <button
          onClick={openModal}
          disabled={isPending}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <p className="text-center text-gray-500 py-8 italic">
          No experience added yet. Click + to add one!
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-sm text-gray-600">
                    {exp.company} • {exp.location || "Remote"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                    –{" "}
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition"
                    title="Edit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(exp._id!)}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition disabled:opacity-50"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Experience" : "Add Experience"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company Name *"
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Job Title *"
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            {!form.isCurrent && (
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
              />
            )}
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={handleCurrentJob}
              className="w-4 h-4"
            />
            <span>I currently work here</span>
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your role, achievements..."
            rows={4}
            className="w-full px-4 py-3 border rounded-lg resize-none"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-5 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isPending || !form.company || !form.title || !form.startDate
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="animate-spin w-5 h-5" />
                  Saving...
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Add Experience"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
