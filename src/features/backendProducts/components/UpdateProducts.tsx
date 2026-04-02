"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSingleProduct } from './hooks/useGetSingleProductHooks';
import { useUpdateProduct } from './hooks/useUpdateProductHook';
import Link from 'next/link';

export default function UpdateProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // 1. Fetch current data to pre-fill the form
  const { data, isLoading: isFetching } = useSingleProduct(id as string);
  
  // 2. Hook for updating
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 3. Fill form when data is loaded
  useEffect(() => {
    if (data?.product) {
      reset(data.product);
    }
  }, [data, reset]);

  const onSubmit = (formData: any) => {
    console.log("your id and data is-->",id,formData)
    updateMutate({ 
      id: id as string, 
      updates: formData 
    });
  };

  if (isFetching) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Sticky Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Edit Product Registry</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {id?.slice(-8)}</p>
            </div>
          </div>
          
          <button 
            form="update-form"
            type="submit" 
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
          >
            {isUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isUpdating ? "Saving..." : "Update Record"}
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                General Specifications
              </h2>
              
              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Official Name</label>
                  <input 
                    {...register("name", { required: "Product name is required" })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-800"
                    placeholder="Enter product title"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message as string}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Clinical/Technical Description</label>
                  <textarea 
                    {...register("description")}
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-600 resize-none"
                    placeholder="Provide detailed technical details..."
                  />
                </div>

                {/* Price and Stock Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Unit Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number"
                        {...register("price", { required: true })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Inventory Level</label>
                    <input 
                      type="number"
                      {...register("stock", { required: true })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Verification</h2>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authorized Supplier</label>
                  <input 
                    {...register("seller")}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rating Score</label>
                  <input 
                    type="number" 
                    step="0.1"
                    {...register("ratings")}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
                    Updates will be immediately visible in the public catalog and warehouse sync.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions / Danger Zone */}
            <div className="px-4">
              <Link 
                href={`/backendProducts/singleProduct/${id}`}
                className="block text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Discard Changes
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}