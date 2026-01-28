interface SkillBadgeProps {
  skills: (string | { name: string })[];
}

export default function SkillBadge({ skills }: SkillBadgeProps) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 text-xl font-bold">Tags</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}            className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-md font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            {typeof skill === "string" ? skill : skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
