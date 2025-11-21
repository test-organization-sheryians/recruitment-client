interface Props {
  skills: string[];
}

export default function SkillsSection({ skills }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Skills</h2>

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
