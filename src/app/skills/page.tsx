// views/SkillPage.jsx
"use client";

import React, { useState } from 'react';
import SkillForm from "@/components/skills/SkillForm";
import SkillList from "@/components/skills/SkillList";
import { FiPlus, FiX } from 'react-icons/fi'; // <-- Import icons for button/modal
import {
  useGetAllSkills,
  useCreateSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "@/features/skills/hooks/useSkillApi";

export default function SkillPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  
  const { data, isLoading, refetch } = useGetAllSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const updateSkill = useUpdateSkill();

  const handleAdd = async (skill: { name: string }) => {
    await createSkill.mutateAsync(skill, {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false); // Close modal on success
      },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteSkill.mutateAsync(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleUpdate = async (skill: { id: string; name: string }) => {
    await updateSkill.mutateAsync(skill, {
      onSuccess: () => refetch(),
    });
  };

  return (
    <div className="min-h-screen p-8 bg-[#18253B] font-sans">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] shadow-2xl rounded-xl p-10 border border-[#446699]/30">

        {/* --- Main Content Area (Now single column) --- */}
        <div className="p-6 bg-[#F8FAFF] rounded-xl border border-[#DDE6F5] shadow-inner">
            
            {/* Header and Add Button Section */}
            <div className="flex justify-between items-center mb-5 border-b pb-3 border-[#DDE6F5]">
                
                {/* Heading */}
                <h2 className="text-2xl font-bold text-[#18253B]">
                    Manage Skills
                </h2>
                
                {/* Button moved here, next to the title */}
                <button
                    onClick={() => setIsModalOpen(true)} // <-- Open the modal
                    className="
                      py-2 px-4
                      bg-[#3668FF] text-white 
                      font-semibold rounded-lg shadow-md
                      hover:bg-[#254BAA] transition duration-200
                      flex items-center gap-2
                    "
                >
                    <FiPlus size={20} /> Add New Skill
                </button>
            </div>
            
            {/* Skill List */}
            <SkillList
                skills={data?.data || []}
                loading={isLoading}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>

      </div>
      
      {/* --- Full-Screen Modal Component --- */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0 
            bg-black/70 backdrop-blur-md 
            flex justify-center items-center 
            z-[100] 
            p-4
          "
          onClick={() => setIsModalOpen(false)} 
        >
          <div
            className="
              bg-white 
              p-8 
              rounded-xl 
              shadow-2xl 
              max-w-lg w-full 
              relative
            "
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
              Add New Skill
            </h3>
            
            <SkillForm onSubmit={handleAdd} />
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close"
            >
              <FiX size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}