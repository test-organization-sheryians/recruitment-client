"use client";
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { Plus, Search, ArrowRight, FileText } from "lucide-react";
import { useCertificate } from "../hooks/useCertificate";
import CreateCertificate from "./CreateCertificate";  
import { Certificate} from "@/types/Certificate"; 


export default function Certificate() {
  const router = useRouter(); 
 
  
  const { 
    certificates, 
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery,
    addCertificate 
  } = useCertificate();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const handleSave = (newCert:Certificate) => {
    addCertificate(newCert);   // 👈 hook wali state update
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
        {/* Create From Scratch Card */}
        <div 
          onClick={() => setIsDrawerOpen(true)}
          className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Plus className="text-slate-400 group-hover:text-blue-600" size={24} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">Create From Scratch</span>
        </div>

        {/* Dynamic Mapping */}
        {certificates.map((certificate) => (
          <div 
            key={certificate._id} 
            onClick={() => router.push('/admin/certificates/generator')}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden cursor-pointer"
          >
            <div>
              <div className="w-full h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <FileText className="text-slate-300 group-hover:text-blue-200" size={40} />
              </div>
              <div className="inline-block px-2 py-1 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                {certificate.type}
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {certificate.name}
              </h3>
              <p className="text-slate-400 text-xs mt-2 line-clamp-2 italic">
                {certificate.description || "Professional template for organizational use."}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Issued By</span>
                <span className="text-xs font-semibold text-slate-600">{certificate.issuedBy || "Sheryians"}</span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  router.push('/admin/certificates/generator');
                }}
                className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm hover:shadow-blue-200"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CREATE CERTIFICATE DRAWER INTEGRATION */}
     
      <CreateCertificate 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}

// "use client";
// import { useState } from "react"; 
// // 1. IMPORT FIX: 'next/router' ki jagah 'next/navigation' use karein
// import { useRouter } from "next/navigation"; 
// import { Plus, Search, ArrowRight, FileText } from "lucide-react";
// import { useCertificate } from "../hooks/useCertificate";
// import CreateCertificate from "./CreateCertificate";  

// export default function Certificate() {
//   // 2. ROUTER INITIALIZE
//   const router = useRouter(); 
//   const { certificates, activeFilter, setActiveFilter, searchQuery, setSearchQuery } = useCertificate();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
//   const categories = ["All Templates", "Completion", "Internship", "Offer", "Other"];

//   return (
//     <div className="space-y-8 p-2">
//       {/* 1. Header Section */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Templates</h1>
//           <p className="text-slate-500 mt-1">Manage and create professional document structures.</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search templates..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 w-64 outline-none transition-all"
//             />
//           </div>
//           <button 
//             onClick={() => setIsDrawerOpen(true)}
//             className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
//           >
//             <Plus size={18} />
//             Add New Template
//           </button>
//         </div>
//       </div>

//       {/* 2. Filter Bar */}
//       <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar">
//           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">Filter By:</span>
//           {categories.map((cat) => (
//             <button 
//               key={cat}
//               onClick={() => setActiveFilter(cat)}
//               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
//                 activeFilter === cat 
//                 ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
//                 : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//       </div>

//       {/* 3. Grid Content */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {/* Create From Scratch Card */}
//         <div 
//           onClick={() => setIsDrawerOpen(true)}
//           className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[300px]"
//         >
//           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
//             <Plus className="text-slate-400 group-hover:text-blue-600" size={24} />
//           </div>
//           <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">Create From Scratch</span>
//         </div>

//         {/* Dynamic Mapping with Card UI */}
//         {certificates.map((certificate) => (
//           <div 
//             key={certificate._id} 
//             // 3. OPTIONAL: Poore card par bhi click laga sakte hain
//             onClick={() => router.push('/admin/certificates/generator')}
//             className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden cursor-pointer"
//           >
//             <div>
//               <div className="w-full h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
//                 <FileText className="text-slate-300 group-hover:text-blue-200" size={40} />
//               </div>
//               <div className="inline-block px-2 py-1 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
//                 {certificate.type}
//               </div>
//               <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
//                 {certificate.name}
//               </h3>
//               <p className="text-slate-400 text-xs mt-2 line-clamp-2 italic">
//                 {certificate.description || "Professional template for organizational use."}
//               </p>
//             </div>

//             {/* Footer info */}
//             <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
//               <div className="flex flex-col">
//                 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Issued By</span>
//                 <span className="text-xs font-semibold text-slate-600">{certificate.issuedBy || "Sheryians"}</span>
//               </div>
              
//               {/* 4. BUTTON NAVIGATION: Arrow par click karne se generator khulega */}
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation(); // Card ke click se clash na ho
//                   router.push('/admin/certificates/generator');
//                 }}
//                 className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm hover:shadow-blue-200"
//               >
//                 <ArrowRight size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <CreateCertificate 
//         isOpen={isDrawerOpen} 
//         onClose={() => setIsDrawerOpen(false)} 
//       />
//     </div>
//   );
// }