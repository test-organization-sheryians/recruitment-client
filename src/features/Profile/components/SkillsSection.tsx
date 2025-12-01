"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

import { useAddSkills, useRemoveSkill, useUpdateProfile } from "../hooks/useProfileApi";
import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";

interface Props {
  skills: string[];
  refetchProfile?: () => void;
}

export default function SkillsSection({ refetchProfile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [userSkills, setUserSkills] = useState([]);


  const { data: skillsResponse = [] } = useGetAllSkills();

  const userSkillNames = selectedSkills
    .map((id) => skillsResponse.find((s: any) => s._id === id)?.name)
    .filter(Boolean);



   const updateSkills=useUpdateProfile();

console.log(selectedSkills)
   const handleUpdateSkills = ()=>{
    updateSkills.mutate(selectedSkills)
   }
   


  const { isPending } = useAddSkills({
    onSuccess: () => {
      setSelectedSkills([]);
      setIsOpen(false);
      refetchProfile?.();
    },
  });

 

  const { mutate: removeSkill } = useRemoveSkill({
    onSuccess: () => refetchProfile?.(),
  });

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

 


  // const handleAddSkills = () => {
  //   if (selectedSkills.length === 0) return;
  //   addSkill({ skills: selectedSkills });
  // };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Skills</h2>

        <button onClick={() => setIsOpen(true)}
          >
          <FaPlus />
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Skills"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto p-3 bg-gray-50 rounded-xl border">
            {skillsResponse.map((skill: any) => {
              const isAlreadyAdded = selectedSkills.includes(skill._id);

              return (
                <label
                  key={skill._id}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition ${
                    isAlreadyAdded
                      ? "bg-green-50 border-green-300 opacity-80"
                      : "bg-white hover:border-blue-300"
                  }`}
                >
                  {!isAlreadyAdded && (
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill._id)}
                      onChange={() => toggleSkill(skill._id)}
                      className="w-5 h-5 text-blue-600"
                    />
                  )}

                  {/* Skill name */}
                  <span
                    className={`text-sm font-medium ${
                      isAlreadyAdded ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {skill.name || skill._id}
                  </span>

                  {isAlreadyAdded && (
                    <span className="ml-auto text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                      Added
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <button
            onClick={handleUpdateSkills}
            disabled={isPending || selectedSkills.length === 0}
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add Selected Skills"}
          </button>
        </div>
      </Modal>

      {userSkillNames.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No skills added yet</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {userSkillNames.map((skillName, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm"
            >
              <span>{skillName}</span>

              <button
                onClick={() => removeSkill(skillName as string)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
