"use client";

import React, { useState, useEffect } from "react";
import SkillForm from "@/features/admin/skills/components/SkillForm";
import SkillList from "@/features/admin/skills/components/SkillList";
import { FiPlus } from "react-icons/fi";
import {
  useGetAllSkills,
  useCreateSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "@/features/admin/skills/hooks/useSkillApi";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function SkillPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success, error } = useToast();

  const {
    data: skills = [],
    isLoading: isFetchingSkills,
    error: fetchError,
  } = useGetAllSkills();

  const {
    mutate: createSkill,
    isPending: isCreating,
    error: createError,
  } = useCreateSkill();

  const {
    mutate: deleteSkill,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteSkill();

  const {
    mutate: updateSkill,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSkill();

  useEffect(() => {
    if (createError) error(createError.message || "Failed to create skill");
    if (deleteError) error(deleteError.message || "Failed to delete skill");
    if (updateError) error(updateError.message || "Failed to update skill");
    if (fetchError) error("Failed to load skills");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, deleteError, updateError, fetchError]);

  const handleAdd = (skill: { name: string }) => {
    createSkill(skill, {
      onSuccess: () => {
        success("Skill added successfully!");
        setIsModalOpen(false);
      },
      onError: () => {},
    });
  };

  const handleDelete = (id: string) => {
    deleteSkill(id, {
      onSuccess: () => success("Skill deleted"),
      onError: (e) => {
        console.log(e);
      },
    });
  };

  const handleUpdate = (skill: { id: string; name: string }) => {
    updateSkill(skill, {
      onSuccess: () => success("Skill updated"),
    });
  };

  const skillCount = skills.length;
  const isAnyLoading = isCreating || isDeleting || isUpdating;

  return (
    <>
      <div className="w-full p-4">
        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <div className="border rounded-md p-4">
            <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#18253B]">
                    Manage Skills
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-[#EBF1FF] px-3 py-1 text-sm font-semibold text-[#3668FF]">
                    {isFetchingSkills ? "..." : skillCount}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Add, edit, and manage all listed skills.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isFetchingSkills || isAnyLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#3668FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#254BAA] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <FiPlus size={18} />
                Add New Skill
              </button>
            </div>

            {fetchError && !isFetchingSkills && (
              <div className="py-10 text-center">
                <p className="mb-4 text-sm font-medium text-red-600">
                  Failed to load skills. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {!fetchError && (
              <SkillList
                skills={skills}
                loading={isFetchingSkills}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Skill"
          maxWidth="sm"
        >
          <SkillForm onSubmit={handleAdd} isSubmitting={isCreating} />
        </Modal>
      )}

      {isAnyLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-xs items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-2xl sm:max-w-sm sm:px-6 sm:py-5">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#3668FF] border-t-transparent sm:h-8 sm:w-8"></div>
            <span className="text-sm font-medium text-gray-700 sm:text-base">
              Please wait...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
