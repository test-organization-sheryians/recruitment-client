import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] p-4 md:p-6">
      {/* App shell */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-2">
          <div className="h-[88vh] rounded-2xl bg-white p-4 border border-gray-600" />
        </aside>

        {/* Main column */}
        <main className="col-span-12 md:col-span-10">
          {/* Top bar */}
          <div className="mb-4 grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <div className="h-12 rounded-2xl bg-white border border-gray-600" />
            </div>
            <div className="col-span-2">
              <div className="h-12 rounded-2xl bg-white border border-gray-600" />
            </div>
            <div className="col-span-2">
              <div className="h-12 rounded-2xl bg-white border border-gray-600" />
            </div>

            {/* KPI strip */}
            <div className="col-span-12 grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
              <div className="col-span-3">
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
              <div className="col-span-3">
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
              <div className="col-span-3">
                <div className="h-24 rounded-2xl bg-white border border-gray-600" />
              </div>
            </div>
          </div>

          {/* Content rows */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left: Vacancies cards */}
            <section className="col-span-12 lg:col-span-7">
              <div className="rounded-2xl bg-white p-4 border border-gray-600">
                {/* Section header */}
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                {/* Cards grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                  <div className="h-40 rounded-2xl bg-white border border-gray-600" />
                </div>
              </div>
            </section>

            {/* Right: Schedule column */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="h-full rounded-2xl bg-white p-4 border border-gray-600">
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                <div className="space-y-3">
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                  <div className="h-14 rounded-xl bg-[#F8FAFF] border border-gray-600" />
                </div>
              </div>
            </aside>

            {/* Bottom: Applicants list and Batches box */}
            <section className="col-span-12 lg:col-span-8">
              <div className="h-[360px] rounded-2xl bg-white p-4 border border-gray-600">
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                <div className="h-[280px] rounded-xl bg-[#F8FAFF] border border-gray-600" />
              </div>
            </section>

            <section className="col-span-12 lg:col-span-4">
              <div className="h-[360px] rounded-2xl bg-white p-4 border border-gray-600">
                <div className="mb-4 h-8 rounded-lg bg-[#F5F7FA] border border-gray-600" />
                <div className="h-[280px] rounded-xl bg-[#F8FAFF] border border-gray-600" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
