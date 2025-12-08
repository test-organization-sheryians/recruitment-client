"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LoaderCircleIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useGetAllSkills } from "@/features/admin/skills/hooks/useSkillApi";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useUpdateProfile1 } from "../hooks/useProfileApi";
import { useDebounce } from "@/features/admin/users/hooks/useDebounce";
import { useSearchSkills } from "../hooks/useSkillSearch";

interface Skill {
  _id: string;
  name: string;
}

interface Props {
  skills: Skill[];
  refetchProfile?: () => void;
}

export default function SkillsSection({ skills: profileSkills = [], refetchProfile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceValue = useDebounce(searchTerm)



  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id

  const { data: allSkills, isLoading: loadingSkills } = useGetAllSkills();
  const { mutate: updateProfile, isPending } = useUpdateProfile1();

  // Extract skill IDs that user already has
  const userSkillIds = profileSkills.map((s) => s._id);
  const userSkillNames = profileSkills.map((s) => s.name);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const addSkills = () => {
    if (!userId || selectedSkillIds.length === 0) return;

    const newSkillIds = selectedSkillIds.filter((id) => !userSkillIds.includes(id));
    if (newSkillIds.length === 0) return;

    const updatedSkillIds = [...userSkillIds, ...newSkillIds];

    updateProfile(
      { id: userId, skills: updatedSkillIds }, // send IDs only
      {
        onSuccess: () => {
          refetchProfile?.();
          toggleModal();
        },

      }
    );
  };

  const removeSkill = (skillId: string) => {
    if (!userId) return;

    const updatedSkillIds = userSkillIds.filter((id) => id !== skillId);

    updateProfile(
      { id: userId, skills: updatedSkillIds },
      {
        onSuccess: () => refetchProfile?.(),
      }
    );
  };

  const { data: skillsResult, isFetching } = useSearchSkills(debounceValue);

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Skills</h2>
        <button
          onClick={toggleModal}
          disabled={loadingSkills || isPending}
          className="p-2 rounded-full bg-blue-600 cursor-pointer text-white hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      </div>

      {userSkillNames.length === 0 ? (
        <p className="text-gray-500 italic py-4">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3 ">
          {profileSkills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-medium"
            >
              <span>{skill.name}</span>
              <button
                onClick={() => removeSkill(skill._id)}
                disabled={isPending}
                className="text-blue-600 hover:text-red-600 transition cursor-pointer"
              >
                {isPending ? (
                  <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                ) : (
                  "×"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Add Skills">
        <div className="p-4 border-b">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>

        <div className="max-h-[120px] w-[500px] overflow-y-scroll p-4 space-y-2 scrollbar-hide">
          {isFetching ? (
            <div className="text-center py-8 text-gray-500">
              <LoaderCircleIcon className="animate-spin mx-auto" />
            </div>
          ) : !searchTerm ? (
            <p className="text-center text-gray-500">Type to search...</p>
          ) : skillsResult?.length === 0 ? (
            <p className="text-center text-gray-500">No skills found.</p>
          )
            : skillsResult?.length === 0 ? (
              <p className="text-center text-gray-500">No skills found</p>
            ) : (
              skillsResult?.map((skill: any) => {
                const isAdded = userSkillIds.includes(skill._id);
                const isSelected = selectedSkillIds.includes(skill._id);

                return (
                  <button
                    key={skill._id}
                    disabled={isAdded}
                    onClick={() => toggleSkill(skill._id)}
                    className={`
            px-5 py-2 rounded-full border transition mr-2 mb-2
            ${isAdded
                        ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                        : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-300 hover:border-blue-500"
                      }
          `}
                  >
                    {skill.name}
                  </button>
                );
              })
            )}
        </div>


        <div className="p-4 border-t">
          <button
            onClick={addSkills}
            disabled={isPending || selectedSkillIds.length === 0}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending ? "Adding..." : `Add ${selectedSkillIds.length} Skill${selectedSkillIds.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </Modal>
    </div>
  );
}