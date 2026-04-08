import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
    label: string;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    onClick?: () => void;
}

export default function ActionButton({
    label,
    icon,
    variant = "secondary",
    onClick,
}: ActionButtonProps) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition",
                variants[variant]
            )}
        >
            {icon && <span className="flex items-center">{icon}</span>}
            {label}
        </button>
    );
}