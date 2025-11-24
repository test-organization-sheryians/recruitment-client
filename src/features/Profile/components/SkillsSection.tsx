import { useState } from "react";
import { useAddSkills, useRemoveSkill } from "../hooks/useProfileApi";

interface Props {
  skills: string[];
  refetchProfile?: () => void; // optional but recommended
}

export default function SkillsSection({ skills, refetchProfile }: Props) {
  const [newSkill, setNewSkill] = useState("");

  const { mutate: addSkill, isPending } = useAddSkills({
    onSuccess: () => {
      refetchProfile?.();
    },
  });

  const { mutate: removeSkill } = useRemoveSkill({
    onSuccess: () => {
      refetchProfile?.();
    },
  });

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    if (skills.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
      alert("Skill already added");
      return;
    }

    addSkill({ skills: [newSkill] });
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    removeSkill(skill);
  };

  return (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Skills</h2>

    {/* Add Skill Input */}
    <div className="flex gap-3 items-center">
      <input
        type="text"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Add a new skill..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/60 transition"
      />
      <button
        onClick={handleAddSkill}
        disabled={isPending}
        className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
      >
        Add
      </button>
    </div>

    {/* Skills Display */}
    {skills.length === 0 ? (
      <div className="text-sm text-gray-500 italic">
        No skills added yet
      </div>
    ) : (<div    className="mt-2 max-h-34 overflow-y-auto pr-1">
      <div className="flex flex-wrap gap-3 mt-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-sm shadow-sm"
          >
            <span className="text-gray-800">{skill}</span>
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-gray-400 hover:text-red-500 transition text-xs font-semibold"
              title="Remove skill"
            >
              ✕
            </button>
          </div>
        ))}
      </div></div>
    )}
  </div>
);

}
