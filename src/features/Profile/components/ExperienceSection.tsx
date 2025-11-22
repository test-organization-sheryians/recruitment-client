interface ExperienceItem {
  company: string;
  title: string;
}

interface Props {
  experience: ExperienceItem[];
}

export default function ExperienceSection({ experience }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold mb-2">Experience</h2>

      {experience.length === 0 ? (
        <p className="text-gray-500">No experience added</p>
      ) : (
        <ul className="space-y-2">
          {experience.map((exp, index) => (
            <li key={index} className="text-sm">
              <strong>{exp.company}</strong> - {exp.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}