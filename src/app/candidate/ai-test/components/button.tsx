import React from "react";

interface PrimaryButtonProps {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-6 w-full py-3 text-lg font-semibold text-white rounded-lg shadow-md transition duration-300
            ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}
        `}
    >
        {children}
    </button>
);