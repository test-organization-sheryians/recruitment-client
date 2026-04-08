interface JobSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function JobSection({ title, children }: JobSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-bold text-gray-900 text-xl">{title}</h2>
      {children}
    </div>
  );
}
