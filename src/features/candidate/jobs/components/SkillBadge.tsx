interface SkillBadgeProps {
  skills: (string | { name: string })[];
}

export default function SkillBadge({ skills }: SkillBadgeProps) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-300 hover:bg-blue-200 transition-colors"
          >
            {typeof skill === "string" ? skill : skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
