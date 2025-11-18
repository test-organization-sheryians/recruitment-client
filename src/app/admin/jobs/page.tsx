"use client"
import { useEffect, useState } from 'react';
import Sidebar from '@/features/admin/Sidebar';
import Navbar from '@/features/admin/Navbar';
import { getJobs } from '@/api/jobs';
import Jobs from '@/features/admin/Jobs';



export default function JobsPage() {


  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] p-4 md:p-6 font-[satoshi]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4">


        <aside className="col-span-12 md:col-span-2">
          <Sidebar />
        </aside>


        <main className="col-span-12 md:col-span-10">
          <Navbar />

        <Jobs />
        </main>


      </div>
    </div>
  );
}
