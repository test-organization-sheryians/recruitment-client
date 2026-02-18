"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Certificate } from "@/types/Certificate"; 
// import { createCertificate , createFields} from "@/api/certificate/createCertificate"; 
import { useRouter } from "next/navigation";
import { useCreateJobApplicationQuestions } from "@/features/job-management/hooks/useJobApplicationQuestions";
import { uploadFileToS3 } from "@/lib/uploadFile";



type Field = {
  id: string;
  title: string;
  type: string;
  placeholder: string;
};

// interface CreateCertificateProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: Certificate) => void;
// }

interface CreateCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Certificate) => Promise<Certificate>;
}


export default function CreateCertificate({ isOpen, onClose, onSave }: CreateCertificateProps) {
  const initialState = { name: "", type: "Completion", file: "", };
  const initialFields = [{ id: "1", title: "", type: "Text Input", placeholder: "" }];

  const [formData, setFormData] = useState(initialState);
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [isUploading, setIsUploading] = useState(false);

    const { mutateAsync: createQuestions } = useCreateJobApplicationQuestions();


//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !file.name.endsWith('.html')) return alert("Please upload .html file");

//   setIsUploading(true);
//   try {
//     // 1. Backend se presigned URL lein (AWS logic)
//     // 2. Us URL par file 'PUT' karein
//     // Maan lijiye link mil gaya:
//     const s3Url = `https://sherihunt.s3.ap-south-1.amazonaws.com/uploads/${file.name}`; 
    
//     // setFormData(prev => ({ ...prev, file: file, fileUrl: s3Url }));
//     setFormData(prev => ({
//   ...prev,
//   file: s3Url   // string save karo
// }));  
//   } catch (err) {
//     // alert("Upload failed");
//     console.log(err)
//   } finally {
//     setIsUploading(false);
//   }
// };


const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile || !selectedFile.name.endsWith('.html')) return alert("Please upload .html file");

  setIsUploading(true);

  try {
    // 🔥 REAL UPLOAD
    const finalUrl = await uploadFileToS3(selectedFile);

    setFormData(prev => ({
      ...prev,
      file: finalUrl
    }));

    console.log("Uploaded successfully:", finalUrl);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    setIsUploading(false);
  }
};




  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setFields(initialFields);
    }
  }, [isOpen]);

  const updateField = (id: string, key: keyof Field, value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const addField = () => {
    setFields([
      ...fields,
      { id: Math.random().toString(36).substr(2, 9), title: "", type: "Text Input", placeholder: "" },
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };
  const router = useRouter();

  const mapInputType = (type: string) => {
  switch (type) {
    case "Text Input":
      return "text";
    case "Date Picker":
      return "date";
    case "File Upload":
      return "file";
    default:
      return "text";
  }
};

const handlePublish = async () => {
  if (!formData.name) return alert("Enter name");
  if (!formData.file.trim()) return alert("Upload file");

   if (fields.some(field => !field.title.trim())) {
    return alert("All field titles are required");
  }

  try {
    const template = await onSave({
      name: formData.name,
      type: formData.type,
      file: String(formData.file),
    });


    console.log("Template response:", template);

   const templateId = template?.data?._id || template?._id;


    if (!templateId) {
      throw new Error("Template ID not returned");
    }

    console.log(template)

    const questions = fields.map((field, index) => ({
      title: field.title,
      inputType: mapInputType(field.type),
      placeholder: field.placeholder,
      isRequired: true,
      isKnockout: false,
      order: index + 1,
    }));

    console.log(questions)


    await createQuestions({
  jobId: templateId,
  questions,
});

router.push(`/offer-generator/${templateId}`);


//     await createQuestions({
//   jobId: templateId,
//   questions,
// });

// router.push(`/offer-generator?id=${templateId}`);


    // await createQuestions({
    //   jobId: templateId,
    //   questions,
       
    // });

    // // alert("Template + Fields Created Successfully");
    // onClose();

  // } catch (error) {
  //   console.error(error);
  //   // alert("Something went wrong");
  // }


  } catch (error: any) {
  console.log("Full error:", error);
  console.log("Backend error:", error?.response?.data);
}

};




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

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

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 italic">General Information</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Template Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Service Agreement 2024"
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
      
            {/* NAYA INPUT BOX: Template File URL */}
           <div className="space-y-2">
  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Template File (.html)</label>
  <div className="flex gap-2">
    <input type="file" accept=".html" id="file-up" onChange={handleFileUpload} className="hidden" />
    
    <div className="flex-1 border border-slate-200 rounded-lg p-3 text-sm bg-slate-50 text-slate-400 truncate">
      {formData.file ? "✅ File Uploaded" : "No file selected"}
    </div>

    <label htmlFor="file-up" className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 cursor-pointer flex items-center gap-2">
      {isUploading ? <span className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" /> : <Plus size={14} />}
      {formData.file ? "Change" : "Upload"}
    </label>
  </div>
</div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category (Type)</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white outline-none"
              >
                <option value="Completion">Completion</option>
                <option value="Internship">Internship</option>
                <option value="Offer">Offer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Input Fields Builder */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 italic">Input Fields Builder</h3>

            {fields.map((field) => (
              <div key={field.id} className="p-5 border border-slate-100 bg-slate-50/30 rounded-2xl space-y-4 relative group hover:border-blue-100 transition-all shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Field Title</label>
                    <input
                      type="text"
                      value={field.title}
                      onChange={(e) => updateField(field.id, "title", e.target.value)}
                      placeholder="e.g Field Title"
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Field Type</label>
                    <select 
                      value={field.type}
                      onChange={(e) => updateField(field.id, "type", e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                    >
                      <option>Text Input</option>
                      <option>Date Picker</option>
                      <option>File Upload</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Placeholder</label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, "placeholder", e.target.value)}
                      placeholder="Enter your placeholder"
                      className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => removeField(field.id)} 
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
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
        <div className="p-6 bg-slate-50/80 border-t grid grid-cols-2 gap-4">
          <button onClick={onClose} className="p-3 text-slate-600 font-bold text-sm hover:bg-white border border-slate-200 rounded-xl transition-all">
            Discard
          </button>
          <button 
            onClick={handlePublish}
            className="p-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Create & Publish
          </button>
        </div>
      </div>
    </div>
  );
}







