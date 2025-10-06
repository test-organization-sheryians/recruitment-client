import React from "react";
import StatusCard from "@/features/admin/components/StatusCard";
import ApplicantsList from "../../../features/admin/components/ApplicantsList";
import Navbar from "@/features/admin/components/Navbar";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] p-4 md:p-6">
      {/* ========= DASHBOARD APP SHELL ========= */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4">
        
        {/* ======= SIDEBAR (Navigation Menu: Dashboard, Jobs, Shortlist, etc.) ======= */}
        <aside className="col-span-12 md:col-span-2">
          <div className="h-[88vh] rounded-2xl bg-white p-4 border border-gray-600" />
        </aside>

        {/* ======= MAIN DASHBOARD AREA ======= */}
        <main className="col-span-12 md:col-span-10">
          
          {/* ======= TOP BAR (Dashboard Header, Search, Profile) ======= */}
          <div className="mb-4 grid grid-cols-12 gap-4">
            {/* Dashboard Title + Breadcrumb or Overview Header */}
            <div className="col-span-12">
              <Navbar />
            </div>

          

            {/* ===== KPI CARDS SECTION (Total Resumes, Shortlisted, etc.) ===== */}
            <div className="col-span-12 grid grid-cols-12 gap-4">
              <div className="col-span-3">
               <StatusCard />
              </div>
              <div className="col-span-3">
                {/* KPI: Shortlisted */}
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
              <div className="col-span-3">
                {/* KPI: Current Vacancies */}
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
              <div className="col-span-3">
                {/* KPI: Batches */}
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
            </div>
          </div>

          {/* ======= MAIN CONTENT SECTIONS ======= */}
          <div className="grid grid-cols-12 gap-4">

            {/* ======= CURRENT VACANCIES SECTION ======= */}
            <section className="col-span-12 lg:col-span-7">
              <div className="rounded-2xl bg-white p-4 border border-gray-600">
                {/* Section Header (e.g., 'Current Vacancies', Sort Dropdown, See All) */}
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                {/* Vacancy Cards (Frontend, Backend roles, etc.) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                </div>
              </div>
            </section>

            {/* ======= RIGHT SIDEBAR (TODAY'S SCHEDULE SECTION) ======= */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="h-full rounded-2xl bg-white p-4 border border-gray-600">
                {/* Section Header (e.g., 'Schedule', Today Dropdown) */}
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                {/* Timeline / Schedule Events */}
                <div className="space-y-3">
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                </div>
              </div>
            </aside>

            {/* ======= APPLICANTS LIST SECTION ======= */}
            <section className="col-span-12 lg:col-span-8">
            <ApplicantsList height={360} width={780}/>
            </section>

            {/* ======= BATCHES LIST SECTION ======= */}
            <section className="col-span-12 lg:col-span-4">
              <div className="h-[360px] rounded-2xl bg-white p-4 border border-gray-600">
                {/* Section Header (e.g., 'Batches List') */}
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                {/* List / Cards / Chart for Batches */}
                <div className="h-[280px] rounded-xl bg-[#F8FAFF] border border-gray-600" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
