import React from "react";

export default function BatchesSection() {
  return (
    <div className='rounded-2xl bg-white p-4 border border-gray-200 h-[360px]'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold'>Batches Lists</h3>
          <span className='text-xs px-2 py-0.5 rounded-full bg-[#E9EFF7] text-[#1270B0]'>
            1124
          </span>
        </div>
        <button className='text-sm underline'>See All</button>
      </div>
      <div className='h-[280px] rounded-xl bg-[#F8FAFF] border border-gray-100 grid place-items-center text-sm text-gray-500'>
        Chart placeholder
      </div>
    </div>
  );
}