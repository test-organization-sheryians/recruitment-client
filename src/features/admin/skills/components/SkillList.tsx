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
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onUpdate: (data: OnUpdateData) => void;
}

import SkillCard from "./SkillCard";

export default function SkillList({
  skills,
  loading,
  onDelete,
  onUpdate,
  isDeleting,
}: SkillListProps) {
  if (loading) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!skills?.length) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        No skills available. Start adding some!
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
