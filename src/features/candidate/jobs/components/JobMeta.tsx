import {
  DollarSign,
  Briefcase,
  BarChart3,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface JobMetaItem {
  label: string;
  value: string | undefined;
  icon?: React.ReactNode;
}

interface JobMetaProps {
  items: JobMetaItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  "salary range": <DollarSign size={20} className="text-blue-600" />,
  "job type": <Briefcase size={20} className="text-blue-600" />,
  "experience level": <BarChart3 size={20} className="text-blue-600" />,
  education: <GraduationCap size={20} className="text-blue-600" />,
  "date posted": <Calendar size={20} className="text-blue-600" />,
};

export default function JobMeta({ items }: JobMetaProps) {
  const filteredItems = items.filter((item) => item.value);

  if (filteredItems.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">ℹ</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg">Job Overview</h3>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
            <div className="mt-1">
              {iconMap[item.label.toLowerCase()] || (
                <Briefcase size={20} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                {item.label}
              </p>
              <p className="font-bold text-gray-900 mt-1 text-base">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
