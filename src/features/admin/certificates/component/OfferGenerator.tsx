"use client";
import React, { useState } from 'react';
import { 
  Printer, Edit3, Cpu, Bell, ChevronRight, 
  FileText, CheckCircle2, RotateCcw, Share2, 
  Download, Trash2, MousePointer2 
} from 'lucide-react';
import { useRouter } from "next/navigation";

export default function OfferGenerator() {
  const router = useRouter();
  const [probation, setProbation] = useState(3);

  return (
    // 'fixed inset-0' se ye poori screen cover kar lega
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col font-sans overflow-hidden text-slate-700">
      
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
        <div className="flex items-center gap-4">
          <Bell size={18} className="text-slate-400" />
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">B</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR (Internal to Generator) --- */}
        <aside className="w-72 border-r border-slate-100 flex flex-col bg-white">
          <div className="p-5 border-b border-slate-50">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Templates</h2>
          </div>
          <div className="flex-1 p-2 space-y-1">
            {["Offer Letter", "NDA Agreement", "Contractor Service"].map((item, i) => (
              <div key={i} className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${i === 0 ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-500'}`}>
                <FileText size={16} />
                <span className="text-xs font-bold">{item}</span>
              </div>
            ))}
          </div>
          <div className="m-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 underline">Need Help?</p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Fill out the fields on the right to auto-populate the legal template variables.</p>
          </div>
        </aside>

        {/* --- MAIN GENERATOR AREA --- */}
        <main className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative">
          
          {/* Floating Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-slate-200 rounded-2xl px-5 py-2 flex items-center gap-6">
              <div className="flex gap-3 text-slate-400 border-r pr-5">
                <RotateCcw size={16} className="hover:text-blue-600 cursor-pointer" />
                <Share2 size={16} className="hover:text-blue-600 cursor-pointer" />
                <Trash2 size={16} className="hover:text-red-500 cursor-pointer" />
              </div>
              <div className="flex gap-6">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600"><Cpu size={14} className="text-blue-500"/> AI Tools</button>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600"><Edit3 size={14}/> Edit</button>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-blue-600"><Printer size={14}/> Print</button>
              </div>
            </div>
          </div>

          {/* Scrolling Form Container */}
          <div className="flex-1 overflow-y-auto p-12 pt-28">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-100 rounded-[2.5rem] p-16 space-y-16">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employment Offer Letter</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Standard HR Template v2.4 (2024)</p>
                <div className="flex flex-col items-center pt-6 gap-2">
                  <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full w-[65%] bg-blue-600"></div>
                  </div>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">65% Complete</span>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                    <h3 className="text-sm font-bold text-slate-800">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pl-9">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Candidate Name</label>
                      <input type="text" placeholder="e.g. Jonathan Doe" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                      <input type="email" placeholder="j.doe@example.com" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all bg-slate-50/30" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                    <h3 className="text-sm font-bold text-slate-800">Contract Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pl-9">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title</label>
                      <select className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30">
                        <option>Senior Software Engineer</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Joining Date</label>
                      <input type="date" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none bg-slate-50/30" />
                    </div>
                  </div>
                </div>

                {/* Step 3: Specific Clauses */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">3</div>
                    <h3 className="text-sm font-bold text-slate-800">Specific Clauses</h3>
                  </div>
                  <div className="space-y-6 pl-9">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Probation Period</span>
                      <span className="text-blue-600">{probation} Months</span>
                    </div>
                    <input 
                      type="range" min="1" max="12" value={probation} 
                      onChange={(e) => setProbation(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                    <textarea 
                      placeholder="Describe training details..." 
                      className="w-full border border-slate-200 rounded-xl p-4 text-sm h-28 outline-none bg-slate-50/30 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-50">
                <button className="px-12 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3">
                  <CheckCircle2 size={16} /> Generate Document
                </button>
                <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
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