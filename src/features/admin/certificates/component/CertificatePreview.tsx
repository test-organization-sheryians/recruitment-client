"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
interface CertificateFormData {
  name?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  probation?: string;
  description?: string;
}

interface Props {
  formData: CertificateFormData;
  onClose: () => void;
}

export default function CertificatePreview({
  formData,
  onClose,
}: Props) {
  const downloadPDF = async () => {
    const element = document.getElementById("certificate-preview");
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scale: 2, // High quality export
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 180);
    pdf.save("Certificate.pdf");
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="bg-white text-black shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          
          {/* Left Section */}
          <div className="flex items-center gap-4">
            
            {/* Success Icon */}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Certificate Generated Successfully
              </h1>
              <p className="text-sm opacity-90">
                Your document is ready for preview and download
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 transition px-5 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex items-center justify-center bg-slate-100 p-10 overflow-auto">

        <div className="bg-white p-16 rounded-3xl shadow-2xl max-w-5xl w-full">

          {/* ===== Certificate Layout ===== */}
          <div
            id="certificate-preview"
            className="border-[6px] border-blue-700 p-14 text-center rounded-2xl"  
          >
            <h1 className="text-4xl font-bold text-blue-800 mb-6">
              Internship Certificate
            </h1>

            <p className="text-lg mb-4 text-slate-700">
              This is to certify that
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">
             Mr.
              {formData.name || "Candidate Name"}
            </h2>

            <p className="text-lg text-slate-700">
              has successfully completed the internship as
            </p>

            <p className="text-xl font-semibold mt-3 text-slate-900">
              {formData.jobTitle || "Job Title"}
            </p>

            <p className="mt-6 text-slate-700">
              From{" "}
              <b>{formData.startDate || "Start Date"}</b> to{" "}
              <b>{formData.endDate || "End Date"}</b>
            </p>

            <p className="mt-4 text-slate-700">
              Probation Period:{" "}
              <b>{formData.probation || "3"} Months</b>
            </p>

            <p className="mt-6 italic text-slate-600">
              {formData.description ||
                "Training details will appear here."}
            </p>

            {/* Signatures */}
            <div className="mt-16 flex justify-between px-12">
              <div>
                <p className="border-t border-black pt-2 text-sm">
                  Authorized Signature
                </p>
              </div>
              <div>
                <p className="border-t border-black pt-2 text-sm">
                  Company Stamp
                </p>
              </div>
            </div>
          </div>

          {/* ===== Buttons ===== */}
          <div className="flex justify-center gap-6 mt-12">
            <button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-xl font-semibold shadow-md"
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 transition px-8 py-3 rounded-xl font-semibold"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
