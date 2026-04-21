"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LoaderCircleIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
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

export default function SkillsSection({
  skills: profileSkills = [],
  refetchProfile,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceValue = useDebounce(searchTerm);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const { mutate: updateProfile, isPending } = useUpdateProfile1();
  const { data: skillsResult, isFetching } = useSearchSkills(debounceValue);

  const userSkillIds = profileSkills.map((s) => s._id);

  const toggleSkill = (id: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addSkills = () => {
    if (!userId || selectedSkillIds.length === 0) return;

    const newIds = selectedSkillIds.filter((id) => !userSkillIds.includes(id));
    if (!newIds.length) return;

    updateProfile(
      { id: userId, skills: [...userSkillIds, ...newIds] },
      {
        onSuccess: () => {
          refetchProfile?.();
          setIsOpen(false);
          setSelectedSkillIds([]);
        },
      }
    );
  };

  const removeSkill = (id: string) => {
    if (!userId) return;

    updateProfile(
      { id: userId, skills: userSkillIds.filter((x) => x !== id) },
      { onSuccess: () => refetchProfile?.() }
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6 border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm bg-white">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Skills
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          disabled={isPending}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      </div>

      {/* SKILLS */}
      {profileSkills.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {profileSkills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200"
            >
              <span className="truncate max-w-[120px] sm:max-w-none">
                {skill.name}
              </span>

              <button
                onClick={() => removeSkill(skill._id)}
                disabled={isPending}
                className="text-blue-600 hover:text-red-600"
              >
                {isPending ? (
                  <LoaderCircleIcon className="w-3 h-3 animate-spin" />
                ) : (
                  "×"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Skills">

        {/* Search */}
        <div className="p-3 sm:p-4 border-b">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>

        {/* Skill List */}
        <div className="max-h-[55vh] overflow-y-auto p-3 sm:p-4">
          {isFetching ? (
            <div className="text-center py-6">
              <LoaderCircleIcon className="animate-spin mx-auto" />
            </div>
          ) : !searchTerm ? (
            <p className="text-center text-gray-500">Type to search...</p>
          ) : skillsResult?.length === 0 ? (
            <p className="text-center text-gray-500">No skills found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skillsResult?.map((skill: Skill) => {
                const isAdded = userSkillIds.includes(skill._id);
                const isSelected = selectedSkillIds.includes(skill._id);

                return (
                  <button
                    key={skill._id}
                    disabled={isAdded}
                    onClick={() => toggleSkill(skill._id)}
                    className={`
                      px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full border transition
                      ${isAdded
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-300 hover:border-blue-500"
                      }
                    `}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="p-3 sm:p-4 border-t">
          <button
            onClick={addSkills}
            disabled={isPending || selectedSkillIds.length === 0}
            className="w-full py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending
              ? "Adding..."
              : `Add ${selectedSkillIds.length} Skill${selectedSkillIds.length !== 1 ? "s" : ""
              }`}
          </button>
        </div>
      </Modal>
    </div>
  );
}