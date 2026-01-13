import { ArrowLeft } from "lucide-react";
import React from "react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onBack: () => void;
};

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "The requested resource could not be found.",
  onBack,
}) => {
  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border animate-fade-in">

        <div className="text-red-500 text-6xl mb-4 animate-bounce">⚠️</div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        <p className="text-gray-800 mb-8 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-[#1447E6] text-white text-md rounded-xl hover:bg-[#18399a] active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
        >
          <ArrowLeft size={18} />Go To Home 
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
