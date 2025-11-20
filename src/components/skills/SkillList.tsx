
"use client";

interface Skill {
  _id: string;
  name: string;
}

interface OnUpdateData {
  id: string;
  name: string;
}

interface SkillListProps {
  skills: Skill[] | null;
  loading: boolean;
  isDeleting:boolean
  onDelete: (id: string) => void;
  onUpdate: (data: OnUpdateData) => void; 
}
import SkillCard from "./SkillCard";

export default function SkillList({ skills, loading, onDelete, onUpdate , isDeleting }: SkillListProps) {
  if (loading) return <p className="text-gray-600 italic">Loading skills...</p>;
  if (!skills?.length) return <p className="text-gray-500">No skills available. Start adding some!</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
      {skills.map((skill) => (
        <SkillCard
          isDeleting={isDeleting}
          key={skill._id}
          skill={skill}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}