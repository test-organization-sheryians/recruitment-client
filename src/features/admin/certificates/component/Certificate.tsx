
"use client";
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { Plus, Search, ArrowRight, FileText, Trash2 } from "lucide-react"; // 👈 Trash2 add kiya
import { useCertificate } from "../hooks/useCertificate";
import CreateCertificate from "./CreateCertificate";  
import type  { Certificate } from "@/types/Certificate";
// import { deleteCertificate } from "@/api/certificate/deleteCertificate";

// 👈 API import ki


export default function Certificate() {
  const router = useRouter(); 
  
  const { 
    certificates, 
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery,
    addCertificate,
    // setCertificates,
    deleteCertificate 
  } = useCertificate();
  
  //  console.log(certificates)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);



const handleSave = async (newCert: Certificate) => {
  try {
    const created = await addCertificate(newCert);
    return created; // 🔥 IMPORTANT
  } catch (err) {
    console.error(err);
    throw err;
  }
};




const handleDelete = async (e: React.MouseEvent, _id: string) => {
  e.stopPropagation();
  if (confirm("Are you sure to delete this template?")) {
    try {
      await deleteCertificate(_id);
      // alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      // alert("Failed to delete");
    }
  }
};
 
  const categories = ["All Templates", "Completion", "Internship", "Offer", "Other"];


  return (
    <div className="space-y-8 p-2">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Templates</h1>
          <p className="text-slate-500 mt-1">Manage and create professional document structures.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 w-64 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} />
            Add New Template
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">Filter By:</span>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === cat 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
      </div>

      {/* 3. Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       

        {/* Dynamic Mapping */}
        {certificates.map((certificate) => (
          <div 
            key={certificate._id} 
            onClick={() => router.push(`/admin/certificates/generator?jobId=${certificate._id}`)}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden cursor-pointer"
          >
            {/* 🔹 DELETE BUTTON ADDED HERE */}
            <button 
              onClick={(e) => handleDelete(e, certificate._id!)} // _id pe ! lagaya kyunki optional hai 
              className="absolute top-3 right-3 p-2 bg-red-50 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
              title="Delete Template"
            >
              <Trash2 size={12} />
            </button>

            <div>  
            



<div className="w-full h-32 rounded-xl mb-4 overflow-hidden bg-slate-100 flex items-center justify-center">
  <iframe
    src={certificate.fileUrl}
    className="w-full h-full object-contain"
  />
</div>



              <div className="inline-block px-2 py-1 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                {certificate.type}
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {certificate.name}
              </h3>
              <p className="text-slate-400 text-xs mt-2 line-clamp-2 italic">
                {/* {certificate.description || "Professional template for organizational use."} */}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
              {/* <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Issued By</span>
                <span className="text-xs font-semibold text-slate-600">{certificate.issuedBy || "Sheryians"}</span>
              </div> */}
              
              <button 
               
                className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm hover:shadow-blue-200"
              >
                <div className="flex items-center gap-2 ">
                     <h1 
                      onClick={(e) => {
                  e.stopPropagation(); 
                  router.push('/admin/certificates/generator');
                }}
                     className="text-xs font-bold">manage</h1>
                <ArrowRight size={16} />
                </div>
             
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateCertificate 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}