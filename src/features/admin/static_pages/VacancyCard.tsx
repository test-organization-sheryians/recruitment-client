import React from "react";
import { useRouter } from "next/navigation";

export type JobData = {
  _id: string;
  title: string;
  education: string;
  skills: any[];
  salary: string;
  location: {
    city: string;
    state: string;
    country: string;
    pincode?: string;
    _id?: string;
  };
  applicantsCount: number;
  createdAt?: string;
};

interface VacancyCardProps {
  data: JobData;
}


export default function VacancyCard({ data }: VacancyCardProps) {

  const router = useRouter();
  return (
    <div onClick={() => router.push(`/admin/applicants/${data._id}`)} className='rounded-2xl border border-gray-200 p-4 cursor-pointer bg-white hover:shadow-sm transition'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gray-100 grid place-items-center overflow-hidden'>
            <span className='text-sm font-semibold'>🏢</span>
          </div>
          <div>
            <h4 className='text-sm font-semibold'>{data.title}</h4>
            <p className='text-xs text-gray-500'>{data.education}</p>
          </div>
        </div>
        <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600'>
          {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Recent"}
        </span>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {(data.skills?.map((s: any) => s.name || s) || []).map((t, index) => (
          <span
            key={`${t}-${index}`}
            className='text-[11px] px-2 py-1 rounded-md bg-[#F5F7FA] text-gray-700'
          >
            {t}
          </span>
        ))}
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2 text-[11px]'>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Job Offer</span>
          {data.salary || "Not Specified"}
        </div>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Location</span>
          {data.location?.city}, {data.location?.state}
        </div>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Applied</span>
          {data.applicantsCount || 0} Applicants
        </div>
      </div>
    </div>
  );
}
