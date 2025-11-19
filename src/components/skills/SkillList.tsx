// components/SkillList.jsx
"use client";

import SkillCard from "./SkillCard";

export default function SkillList({ skills, loading, onDelete, onUpdate }) {
  if (loading) return <p className="text-gray-600 italic">Loading skills...</p>;
  if (!skills?.length) return <p className="text-gray-500">No skills available. Start adding some!</p>;

  return (
    // Updated grid classes to ensure 4 columns are shown on medium and large screens.
    // md:grid-cols-4 and lg:grid-cols-4 enforce the 4-in-a-row layout.
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