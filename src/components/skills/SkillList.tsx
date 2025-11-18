"use client";

import SkillCard from "./SkillCard";

export default function SkillList({ skills, loading, onDelete, onUpdate }) {
  if (loading) return <p className="text-gray-600 italic">Loading skills...</p>;
  if (!skills?.length) return <p className="text-gray-500">No skills available. Start adding some!</p>;

  return (
   
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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