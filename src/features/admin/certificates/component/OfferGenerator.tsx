"use client";
import React, { useState } from "react";
import { readExcelFile } from "../utils/excelReader";
import { generateBulkCertificates } from "../utils/bulkGenerator";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";

import {
  Printer,
  Edit3,
  Cpu,
  Bell,
  ChevronRight,
  FileText,
  CheckCircle2,
  RotateCcw,
  Share2,
  Download,
  Trash2,
  MousePointer2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function OfferGenerator() {
  const router = useRouter();
  // const [probation, setProbation] = useState(3);
  const [showCertificate, setShowCertificate] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "Senior Software Engineer",
    startDate: "",
    endDate: "",
    probation: 3,
    description: "",
  });

  const handleExcelUpload = async (e: any) => {
    const file = e.target.files[0];

    const students = await readExcelFile(file);

    const zipBlob = await generateBulkCertificates(students);

    saveAs(zipBlob, "Certificates.zip");
  };

  return (
    // 'fixed inset-0' se ye poori screen cover kar lega
    <div className="absolute inset-0 z-[9999] bg-white flex flex-col font-sans overflow-hidden text-slate-700">
      {/* --- TOP NAV BAR --- */}
      <header className="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <FileText size={18} />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight">
            <span className="text-slate-400">Templates</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-800">Offer Letter Generator</span>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <Bell size={18} className="text-slate-400" />
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
            B
          </div>
        </div> */}
      </header>

      <div className="flex flex-1 overflow-hidden">
        

        {/* --- MAIN GENERATOR AREA --- */}
        <main className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative">
          {/* Floating Toolbar */}
          {/* <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-slate-200 rounded-2xl px-5 py-2 flex items-center gap-6">
              <div className="flex gap-3 text-slate-400 border-r pr-5">
                <RotateCcw
                  size={16}
                  className="hover:text-blue-600 cursor-pointer"
                />
                <Share2
                  size={16}
                  className="hover:text-blue-600 cursor-pointer"
                />
                <Trash2
                  size={16}
                  className="hover:text-red-500 cursor-pointer"
                />
              </div>
              <div className="flex gap-6">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600">
                  <Cpu size={14} className="text-blue-500" /> AI Tools
                </button>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600">
                  <Edit3 size={14} /> Edit
                </button>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600">
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>
          </div> */}

          {/* Scrolling Form Container */}
          <div className="flex-1 overflow-y-auto p-12 pt-20">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-100 rounded-[2.5rem] p-16 space-y-16">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Employment Offer Letter 
                </h1>
                {/* <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Standard HR Template v2.4 (2024)</p> */}
                {/* <div className="flex flex-col items-center pt-6 gap-2">
                    <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-blue-600"></div>
                    </div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">65% Complete</span>
                  </div> */}
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pl-9">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Candidate Name
                      </label>
                      {/* <input type="text" placeholder="e.g. Jonathan Doe" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30" /> */}
                      <input
                        type="text"
                        placeholder="e.g. Jonathan Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="j.doe@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30"
                      />

                      {/* <input type="email" placeholder="j.doe@example.com" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30" /> */}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      2
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Contact Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pl-9">
                    <div className="space-y-1.5">
                      {/* <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title</label>
                        <select className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30">
                          <option>Senior Software Engineer</option>
                        </select> */}

                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Job Title
                      </label>

                      <select
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jobTitle: e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30"
                      >
                        <option value="Senior Software Engineer">
                          Senior Software Engineer
                        </option>

                        <option value="Frontend Developer">
                          Frontend Developer
                        </option>

                        <option value="Backend Developer">
                          Backend Developer
                        </option>

                        <option value="Full Stack Developer">
                          Full Stack Developer
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30"
                      />

                      {/* <input type="date" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30" /> */}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30"
                      />

                      {/* <input type="date" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30" /> */}
                    </div>
                  </div>
                </div>

                {/* Step 3: Specific Clauses */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Specific Clauses
                    </h3>
                  </div>
                  <div className="space-y-6 pl-9">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Probation Period</span>
                      <span className="text-blue-600">
                        {formData.probation} Months
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={formData.probation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          probation: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    {/* <textarea 
                        placeholder="Describe training details..." 
                        className="w-full border border-slate-200 rounded-xl p-4 text-sm h-28 outline-none bg-slate-50/30 resize-none"
                      ></textarea> */}

                    <textarea
                      placeholder="Describe training details..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl p-4 text-sm h-28 outline-none bg-slate-50/30 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-50">
                {/* <button className="px-12 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3">
                    <CheckCircle2 size={16} /> Generate Document
                  </button> */}

                <div className="w-full text-center mb-4">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    className="block mx-auto text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload Excel file to generate bulk certificates
                  </p>
                </div>

                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-12 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3"
                >
                  <CheckCircle2 size={16} /> Generate Document
                </button>

                <button
                  onClick={async () => {
                    const element = document.getElementById("single-preview");
                    if (!element) return;

                    // const canvas = await html2canvas(element);
                    const canvas = await html2canvas(element, {
                      backgroundColor: "#ffffff",
                      useCORS: true,
                    });

                    const imgData = canvas.toDataURL("image/png");

                    const pdf = new jsPDF("landscape");
                    pdf.addImage(imgData, "PNG", 10, 10, 270, 180);

                    pdf.save("Certificate.pdf");
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
                >
                  Download PDF
                </button>

                {showCertificate && (
                  // <div className="mt-12 bg-white border-4 border-blue-700 p-12 text-center rounded-2xl shadow-2xl">
                  <div
                    id="single-preview"
                    className="mt-12 bg-white border-4 border-blue-700 p-12 text-center rounded-2xl shadow-2xl"
                  >
                    <h1 className="text-4xl font-bold text-blue-800 mb-6">
                      Internship Certificate
                    </h1>

                    <p className="text-lg mb-4">This is to certify that</p>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      {formData.name || "Student Name"}
                    </h2>

                    <p className="text-lg">
                      has successfully completed the internship as
                    </p>

                    <p className="text-xl font-semibold mt-2">
                      {formData.jobTitle}
                    </p>

                    <p className="mt-4">
                      from <b>{formData.startDate || "Start Date"}</b> to{" "}
                      <b>{formData.endDate || "End Date"}</b>
                    </p>

                    <p className="mt-4">
                      Probation Period: {formData.probation} Months
                    </p>

                    <p className="mt-6 italic text-gray-600">
                      {formData.description ||
                        "Training details will appear here"}
                    </p>

                    <div className="mt-10 flex justify-between">
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

                <button
                  onClick={() => router.back()}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  ✕ Back to Templates
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-8 mt-12 opacity-30 text-[9px] font-bold uppercase tracking-widest">
              <span>Encrypted & Secure</span>
              <span>Autosaved</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


