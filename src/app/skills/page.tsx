"use client";

import SkillForm from "@/components/skills/SkillForm";
import SkillList from "@/components/skills/SkillList";
import {
  useGetAllSkills,
  useCreateSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "@/features/skills/hooks/useSkillApi";

export default function SkillPage() {
  const { data, isLoading, refetch } = useGetAllSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const updateSkill = useUpdateSkill();

  const handleAdd = async (skill: { name: string }) => {
    await createSkill.mutateAsync(skill);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteSkill.mutateAsync(id);
    refetch();
  };

  const handleUpdate = async (skill: { id: string; name: string }) => {
    await updateSkill.mutateAsync(skill);
    refetch();
  };

  return (
  
    <div className="min-h-screen p-8 bg-[#18253B] font-sans">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] shadow-2xl rounded-xl p-10 border border-[#446699]/30">

       
        <h1 className="text-4xl font-extrabold text-[#3668FF] mb-8 tracking-tight">
          Skills Management
        </h1>
        
       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            
            <div className="lg:col-span-2 p-6 bg-[#F8FAFF] rounded-xl border border-[#DDE6F5] shadow-inner">
                <h2 className="text-2xl font-bold text-[#18253B] mb-5 border-b pb-3 border-[#DDE6F5]">
                    Skills
               
                </h2>
                <SkillList
                    skills={data?.data || []}
                    loading={isLoading}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>

            <div className="lg:col-span-1 p-6 bg-[#EBF1FF] rounded-xl border border-[#BBCFFF] shadow-md">
                <h2 className="text-2xl font-semibold text-[#3668FF] mb-5 border-b pb-3 border-[#BBCFFF]">
                    Add New Skill
                </h2>
             
                <SkillForm onSubmit={handleAdd} />
            </div>

        </div>

      </div>
    </div>
  );
}