// views/SkillPage.jsx
"use client";

import React, { useState } from 'react';
import SkillForm from "@/components/skills/SkillForm";
import SkillList from "@/components/skills/SkillList";
import Sidebar from "../../features/admin/Sidebar"
import Navbar from "../../features/admin/Navbar"
import { FiPlus, FiX } from 'react-icons/fi'; 
import {
  useGetAllSkills,
  useCreateSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "@/features/skills/hooks/useSkillApi";

export default function SkillPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const { data, isLoading, refetch } = useGetAllSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const updateSkill = useUpdateSkill();

  const handleAdd = async (skill: { name: string }) => {
    await createSkill.mutateAsync(skill, {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false); 
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
  

  const skillCount = data?.data?.length || 0;

  return (
    <div className="min-h-screen flex  mt-[100px] p-8 bg-white font-sans">
         <div><Sidebar active='Skills' /></div>
      <div className="max-w-6xl mr-[10px] mx-auto bg-[#FFFFFF] shadow-2xl rounded-xl p-10 border border-[#446699]/30">
         
<div><Navbar/></div>
       
        <div className="p-6 bg-white rounded-xl border border-[#DDE6F5] shadow-inner">
               
            
        
            <div className="flex justify-between  items-center mb-5 border-b pb-3 border-[#DDE6F5]">
              
                
              
                <h2 className="text-2xl font-semibold text-[#18253B]">
                    Manage Skills
                    
               
                    <span 
                      className="
                        ml-3 px-3 py-1 text-sm font-semibold 
                        bg-[#EBF1FF] text-[#3668FF] 
                        rounded-full 
                        align-middle
                      "
                    >
                      {isLoading ? '...' : skillCount}
                    </span>
                </h2>
                
         
                <button
                    onClick={() => setIsModalOpen(true)}
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
            
     
            <SkillList
                skills={data?.data || []}
                loading={isLoading}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>

      </div>
      
     
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
            <h3 className="text-3xl font-light text-gray-800 mb-6 border-b pb-3">
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