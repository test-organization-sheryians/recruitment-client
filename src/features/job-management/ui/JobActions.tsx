import { ReactNode } from "react";
import { Pencil, Share2, Trash2, HelpCircle } from "lucide-react";
import ActionButton from "./ActionButton";

interface Action {
    label: string;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    onClick?: () => void;
}

interface JobActionsProps {
    actions?: Action[];
}

const defaultActions: Action[] = [
    {
        label: "Edit Job",
        icon: <Pencil className="w-4 h-4" />,
        variant: "primary",
        onClick: () => console.log("Edit"),
    },
    {
        label: "Questions",
        icon: <HelpCircle className="w-4 h-4" />,
    },
    {
        label: "Share Link",
        icon: <Share2 className="w-4 h-4" />,
    },
    {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4" />,
        variant: "danger",
    },
];

export default function JobActions({ actions = defaultActions }: JobActionsProps) {
    return (
        <div className="flex gap-3">
            {actions.map((action, index) => (
                <ActionButton
                    key={index}
                    label={action.label}
                    icon={action.icon}
                    variant={action.variant}
                    onClick={action.onClick}
                />
            ))}
        </div>
    );
}