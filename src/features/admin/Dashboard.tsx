"use client";

import ApplicantsSection from "./ApplicantsSection";
import BatchesSection from "./BatchesSection";
import KpisRow from "./KpisRow";
import Navbar from "./Navbar";
import Schedule from "./Schedule";
import Sidebar from "./Sidebar";
import VacanciesSection from "./VacanciesSection";


export default function AdminDashboard() {
  return (
    <div className='min-h-screen w-full bg-[#F0F2F5] p-4 md:p-6 font-[satoshi]'>
      <div className='mx-auto grid max-w-[1400px] grid-cols-12 gap-4'>
        <aside className='col-span-12 md:col-span-2'>
          <Sidebar active='Dashboard' />
        </aside>

        <main className='col-span-12 md:col-span-10'>
          <div className='mb-4'>
            <Navbar />
          </div>

          <KpisRow />

          <div className='grid grid-cols-12 gap-4'>
            <section className='col-span-12 lg:col-span-7'>
              <VacanciesSection height={500} />
            </section>

            <aside className='col-span-12 lg:col-span-5'>
              <Schedule height={500} />
            </aside>

            <section className='col-span-12 lg:col-span-8'>
              <ApplicantsSection width={720} />
            </section>

            <section className='col-span-12 lg:col-span-4'>
              <BatchesSection />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}