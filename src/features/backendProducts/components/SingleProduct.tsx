"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSingleProduct } from './hooks/useGetSingleProductHooks';
import Link from 'next/link';

export default function ProductDetailsPage() {
  let params=useParams()
  const id=params?.id as string
  console.log("your id is",id)
  const router = useRouter();
  const { data, isLoading, isError } = useSingleProduct(id);

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Clinical Data...</div>;
  if (isError || !data?.product) return <div className="p-20 text-center text-red-500">Product Not Found</div>;

  const product = data.product;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigation */}
        <header className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition shadow-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to Shop
          </button>
          <div className="hidden sm:block text-[10px] font-bold tracking-[0.2em] text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
            SKU: {product._id?.slice(-8).toUpperCase()}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 relative">
                <div className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-200 mb-6">
                  {product.name?.charAt(0)}
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Verified Supply
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Product Specification
              </h2>
              <p className="text-slate-500 leading-relaxed min-h-[100px]">
                {product.description || "No clinical specifications provided for this asset."}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Conversion */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8 sticky top-8">
              
              <div className="flex justify-between items-start">
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100">
                  ⭐ {product.ratings} / 5.0
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter border ${
                  product.stock > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                }`}>
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-400 font-medium">
                  MANUFACTURER/SELLER: <span className="text-blue-600 font-bold uppercase">{product.seller}</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Market Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
                  <span className="text-slate-400 font-bold text-sm">/unit</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  disabled={product.stock <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Procure Now
                </button>
                
                <Link 
                  href={`/backendProducts/updateProduct/${product._id}`}
                  className="block w-full text-center border border-slate-200 text-slate-500 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Edit Registry Information
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight font-medium uppercase tracking-wider">
                  Quality Assured & <br /> Regulatory Compliant
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}