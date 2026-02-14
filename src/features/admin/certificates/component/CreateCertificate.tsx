"use client";
import React, { useState } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";

type Field = {
  id: string;
  title: string;
  type: string;
  placeholder: string;
};

interface CreateCertificateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCertificate({ isOpen, onClose }: CreateCertificateProps) {
  // Backend model ke fields
  const [formData, setFormData] = useState({
    name: "",
    type: "Completion", // Default value from backend enum
    file: "",
      url: ""  
  });

  // Dynamic Fields State (Aapke UI ke hisaab se)
  const [fields, setFields] = useState<Field[]>([
    { id: "1", title: "Client Name", type: "Text Input", placeholder: "Enter full name" }
  ]);

  const addField = () => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      type: "Text Input",
      placeholder: ""
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer Body */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Template</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Step 1: Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* General Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 italic">General Information</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Template Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Service Agreement 2024" 
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category (Type)</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white outline-none"
              >
                <option value="Completion">Completion</option>
                <option value="Internship">Internship</option>
                <option value="Offer">Offer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
    Template URL
  </label>
  <input 
    type="url"
    value={formData.url}
    onChange={(e) => setFormData({...formData, url: e.target.value})}
    placeholder="e.g., https://example.com/template"
    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
  />
</div>

          </div>

          {/* Input Fields Builder Section */}
          <div className="space-y-4 pt-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 italic">Input Fields Builder</h3>
                <span className="text-[10px] text-slate-400 font-medium">Drag to reorder</span>
             </div>

             {fields.map((field) => (
               <div key={field.id} className="p-5 border border-slate-100 bg-slate-50/30 rounded-2xl space-y-4 relative group hover:border-blue-100 transition-all shadow-sm">
                  <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical size={18} className="text-slate-300" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Field Title</label>
                        <input type="text" placeholder="e.g. Full Name" className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm" />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Field Type</label>
                        <select className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                           <option>Text Input</option>
                           <option>Date Picker</option>
                           <option>File Upload</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Placeholder</label>
                        <input type="text" placeholder="Enter placeholder" className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm" />
                     </div>
                  </div>
                  
                  <button onClick={() => removeField(field.id)} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                     <Trash2 size={16} />
                  </button>
               </div>
             ))}

             <button 
               onClick={addField}
               className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600 transition-all active:scale-[0.98]"
             >
                <Plus size={18} /> Add New Field
             </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/80 border-t grid grid-cols-3 gap-3">
          <button onClick={onClose} className="px-4 py-3 text-slate-600 font-bold text-xs hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
            Discard Changes
          </button>
          <button className="px-4 py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all">
            Save Draft
          </button>
          <button className="px-4 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            Create & Publish
          </button>
        </div>
      </div>
    </div>
  );
}