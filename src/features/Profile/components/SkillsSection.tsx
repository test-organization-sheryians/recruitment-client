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
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">Skills</h2>

      {/* ADD SKILL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleAddSkill}
          disabled={isPending}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* DISPLAY SKILLS */}
      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
