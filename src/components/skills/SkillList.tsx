
"use client";

interface Skill {
  _id: string; // Keep this if you use it for the key or data fetching
  name: string;
  // ... other properties
}

interface OnUpdateData {
  id: string;
  name: string;
}

interface SkillListProps {
  skills: Skill[] | null;
  loading: boolean;
  onDelete: (id: string) => void;
  // Change the type to match exactly what SkillCard passes:
  onUpdate: (data: OnUpdateData) => void; 
}
import SkillCard from "./SkillCard";

export default function SkillList({ skills, loading, onDelete, onUpdate }: SkillListProps) {
  if (loading) return <p className="text-gray-600 italic">Loading skills...</p>;
  if (!skills?.length) return <p className="text-gray-500">No skills available. Start adding some!</p>;

  return (

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill._id}
          skill={skill}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}