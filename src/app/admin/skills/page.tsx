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
    if (createError)
      error(createError.message || "Failed to create skill");
    if (deleteError)
      error(deleteError.message || "Failed to delete skill");
    if (updateError)
      error(updateError.message || "Failed to update skill");
    if (fetchError) error("Failed to load skills");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, deleteError, updateError, fetchError]);

  const handleAdd = (skill: { name: string }) => {
    createSkill(skill, {
      onSuccess: () => {
        success("Skill added successfully!");
        setIsModalOpen(false);
      },
      onError: () => {
      },
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

      <div className="min-h-screen flex bg-gray-100">
        <div className="flex-grow flex flex-col p-4 space-y-4">
          <div className="flex-grow p-4 bg-gray-50 rounded-xl">
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md relative">
              <div className="flex justify-between items-center mb-5 border-b pb-3 border-[#DDE6F5]">
                <h2 className="text-2xl font-bold text-[#18253B]">
                  Manage Skills
                  <span className="ml-3 px-3 py-1 text-sm font-semibold bg-[#EBF1FF] text-[#3668FF] rounded-full">
                    {isFetchingSkills ? "..." : skillCount}
                  </span>
                </h2>

                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isFetchingSkills || isAnyLoading}
                  className="py-2 px-4 bg-[#3668FF] text-white font-semibold rounded-lg shadow-md hover:bg-[#254BAA] transition duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiPlus size={20} />
                  Add New Skill
                </button>
              </div>

              {fetchError && !isFetchingSkills && (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium mb-4">
                    Failed to load skills. Please try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#3668FF] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">
              Please wait...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
