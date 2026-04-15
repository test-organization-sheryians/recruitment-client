import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FilterButtonProps {
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick?: () => void;
}

export default function FilterButton({
    label,
    icon,
    active = false,
    onClick,
}: FilterButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer",
                active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            )}
        >
            <span>{label}</span>
            {icon && <span className="flex items-center">{icon}</span>}
        </button>
    );
}