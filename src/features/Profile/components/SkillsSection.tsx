"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { LoaderCircleIcon } from "lucide-react";

import { useAddSkills, useGetProfile, useRemoveSkill, useUpdateProfile } from "../hooks/useProfileApi";
import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";

interface Props {
  skills: string[];
  refetchProfile?: () => void;
}

export default function SkillsSection({ refetchProfile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [deletingSkill, setDeletingSkill] = useState<string | null>(null); // ⭐ Track which skill is deleting

  const { data: profile, refetch } = useGetProfile();
  const userSkills = profile?.skills || [];

  const { data: skillsResponse = [] } = useGetAllSkills();

  // Update Skills
  const updateSkills = useUpdateProfile(() => {
    refetch();
    setSelectedSkills([]);
    setIsOpen(false);
    refetchProfile?.();
  });

  const handleUpdateSkills = () => {
    updateSkills.mutate(selectedSkills);
  };

  // Remove Skill
  const { mutate: removeSkill } = useRemoveSkill({
    onSuccess: () => {
      setDeletingSkill(null);
      refetch();
      refetchProfile?.();
    },
    onError: () => {
      setDeletingSkill(null);
    }
  });

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
        <button onClick={() => setIsOpen(true)}>
          <FaPlus />
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Skills"
      >
        <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-3 bg-gray-50 rounded-xl border">
          {skillsResponse.map((skill: any) => {
            const isAlreadyAdded = userSkills.includes(skill.name);
            const isSelected = selectedSkills.includes(skill._id);

            return (
              <button
                type="button"
                key={skill._id}
                disabled={isAlreadyAdded}
                onClick={() => !isAlreadyAdded && toggleSkill(skill._id)}
                className={`
                  px-4 py-1.5 rounded-full border text-sm transition
                  ${isAlreadyAdded
                    ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                    : isSelected
                      ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-[#60A5FA]"
                  }
                `}
              >
                {skill.name}
              </button>
            );
          })}
        </div>

        {/* Add Skills Button */}
        <button
          onClick={handleUpdateSkills}
          disabled={updateSkills.isPending || selectedSkills.length === 0}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 flex justify-center"
        >
          {updateSkills.isPending ? <LoaderCircleIcon /> : "Add Selected Skills"}
        </button>
      </Modal>

      {/* Display Skills */}
      {userSkills.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No skills added yet</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {userSkills.map((skillName, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm"
            >
              <span>{skillName}</span>

              <button
                onClick={() => {
                  setDeletingSkill(skillName); // ⭐ set loader for this skill only
                  removeSkill(skillName);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                {deletingSkill === skillName ? (
                  <LoaderCircleIcon className="animate-spin w-4 h-4" />
                ) : (
                  "✕"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
