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
    
    <div>
      <main className='col-span-12 md:col-span-10'>
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
  );
}