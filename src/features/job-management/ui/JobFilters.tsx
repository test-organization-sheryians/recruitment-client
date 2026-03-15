import { ReactNode } from "react";
import { Check, Edit, Briefcase } from "lucide-react";
import FilterButton from "./FilterButton";

interface Filter {
    key: string;
    label: string;
    icon?: ReactNode;
}

interface JobFiltersProps {
    filters?: Filter[];
    active: string;
    onChange: (key: string) => void;
}

const defaultFilters: Filter[] = [
    { key: "all", label: "All Jobs" },
    { key: "active", label: "Active", icon: <Check className="w-4 h-4" /> },
    { key: "draft", label: "Draft", icon: <Edit className="w-4 h-4" /> },
    { key: "filled", label: "Filled", icon: <Briefcase className="w-4 h-4" /> },
];

export default function JobFilters({
    filters = defaultFilters,
    active,
    onChange,
}: JobFiltersProps) {
    return (
        <div className="flex gap-3">
            {filters.map((filter) => (
                <FilterButton
                    key={filter.key}
                    label={filter.label}
                    icon={filter.icon}
                    active={active === filter.key}
                    onClick={() => onChange(filter.key)}
                />
            ))}
        </div>
    );
}