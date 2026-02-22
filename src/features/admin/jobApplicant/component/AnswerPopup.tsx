import React from "react";
import { X, FileText} from "lucide-react";

export interface QuestionAnswer {
  question: string; 
  answer: string | string[]; 
}

interface AnswerPopupProps {
  isOpen: boolean;
  onClose: () => void; // Function to close the popup
  applicantName: string; 
  answers: QuestionAnswer[];
}

export default function AnswerPopup({
  isOpen,
  onClose,
  applicantName,
  answers,
}: AnswerPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Screening Questions
              </h2>
              <p className="text-sm text-gray-500">
                Applicant: <span className="font-semibold">{applicantName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 bg-gray-50 flex-1">
          {!answers || answers.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed">
              This applicant did not fill out any screening questions.
            </div>
          ) : (
            answers.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border shadow-sm">
                <div className="flex items-start gap-2 mb-3">
               {/* //   <HelpCircle size={18} className="text-blue-500 mt-0.5 shrink-0" /> */}
                  <h3 className="font-semibold text-gray-800">
                    <span className="text-blue-500 mr-2">Q{index + 1}.</span>
                    {item.question}
                  </h3>
                </div>
                <div className="ml-7 p-3 bg-blue-50/50 border border-blue-100 rounded-md text-gray-700">
                  <span className="font-semibold text-blue-800 text-xs uppercase tracking-wider block mb-1">
                    Answer:
                  </span>
                  {Array.isArray(item.answer) ? (
                    <ul className="list-disc list-inside">
                      {item.answer.map((ans, i) => (
                        <li key={i}>{ans}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.answer || <span className="text-gray-400 italic">No answer provided</span>}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 border text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}