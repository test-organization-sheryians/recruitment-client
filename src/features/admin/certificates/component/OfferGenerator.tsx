"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetJobApplicationQuestions } from "@/features/job-management/hooks/useJobApplicationQuestions";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CheckCircle2, ChevronRight, FileText } from "lucide-react";



type Field = {
  _id: string;
  title: string;
  inputType: string;
  placeholder: string;
};

export default function OfferGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const { data: dbData, isLoading } =
    useGetJobApplicationQuestions(jobId ?? "");

  // const [formData, setFormData] = useState<Record<string, Field>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // 🔥 Initialize dynamic fields from backend
  useEffect(() => {
    if (dbData?.data?.length) {
      const initialState: Record<string, string> = {};

      dbData.data.forEach((question: Field) => {
        initialState[question.title] = "";
      });

      setFormData(initialState);
    }
  }, [dbData]);

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="absolute inset-0 bg-white flex flex-col font-sans text-slate-700">
      
      {/* HEADER */}
      {/* <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <FileText size={18} />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase">
            <span
              onClick={() => router.back()}
              className="text-slate-400 cursor-pointer"
            >
              Templates
            </span>
            <ChevronRight size={12} />
            <span className="text-slate-800">Offer Generator</span>
          </div>
        </div>
      </header> */}

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto bg-white shadow border rounded-3xl p-12 space-y-10">

          <h1 className="text-2xl font-bold text-center">
            Employment Offer Letter
          </h1>

          {/* 🔥 DYNAMIC FORM FIELDS */}
          <div className="space-y-6">
            {dbData?.data?.map((question: Field) => (
              <div key={question._id} className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  {question.title}
                </label>

                <input
                  type={question.inputType || "text"}
                  placeholder={question.placeholder}
                  value={formData[question.title] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [question.title]: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50"
                />
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col items-center gap-4 pt-8 border-t">

            <button
              onClick={() => setShowPreview(true)}
              className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Generate Document
            </button>

            <button
              onClick={async () => {
                const element = document.getElementById("preview");
                if (!element) return;

                const canvas = await html2canvas(element, {
                  backgroundColor: "#ffffff",
                  useCORS: true,
                });

                const imgData = canvas.toDataURL("image/png");

                const pdf = new jsPDF("landscape");
                pdf.addImage(imgData, "PNG", 10, 10, 270, 180);
                pdf.save("OfferLetter.pdf");
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Download PDF
            </button>

          </div>

          {/* 🔥 DYNAMIC PREVIEW */}
          {showPreview && (
            <div
              id="preview"
              className="mt-10 bg-white border-4 border-blue-700 p-10 rounded-2xl shadow-xl"
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                Internship / Offer Certificate
              </h2>

              <div className="space-y-4 text-lg">
                {Object.keys(formData).map((key) => (
                  <p key={key}>
                    <b>{key}:</b>{" "}
                    {formData[key] ? formData[key] : "__________"}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex justify-between">
                <div>
                  <p className="border-t border-black pt-2">
                    Authorized Signature
                  </p>
                </div>
                <div>
                  <p className="border-t border-black pt-2">
                    Company Stamp
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}