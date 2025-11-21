import { useState } from "react";
import { useAddSkills } from "../hooks/useProfileApi";

interface Props {
  skills: string[];
  
}

export default function SkillsSection({ skills }: Props) {
  const [newSkill, setNewSkill] = useState("");
  const { mutate, isPending } = useAddSkills({
  onSuccess: (data) => {
    console.log("✅ Skill added response:", data);
  },
  onError: (error) => {
    console.error("❌ Error adding skill:", error);
  },
});


 const handleAddSkill = () => {
  if (!newSkill.trim()) return;

  if (skills.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
    alert("Skill already added");
    return;
  }

  mutate({ skills: [newSkill] });
  setNewSkill("");
};


  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">Skills</h2>

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

      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
