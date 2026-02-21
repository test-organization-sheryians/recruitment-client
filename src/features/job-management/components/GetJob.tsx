// "use client"

// import { useEffect, useState, useCallback, useMemo } from "react"
// import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi"
// import { useRouter } from "next/navigation"
// import { Archive, CheckCheck, CheckCircle2, ChevronDown, Edit3 } from "lucide-react"

// import CreateJobButton from "../ui/CreateJobButton"
// import FilterButton from "../ui/FilterButton"
// import JobCard from "./JobCard"
// import PaginationBar from "./PaginationBar"

// import { Job } from "@/types/Job"
// import ShareJobModal from "./ShareJobModal"

// /* ================= TYPES ================= */

// type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"

// const PAGE_SIZE = 10

// export default function Jobs() {
//   const router = useRouter()

//   const {
//     data: jobPages,
//     isLoading,
//     error: fetchError,
//     refetch,
//     fetchNextPage,
//     hasNextPage,
//   } = useInfiniteJobsAdmin()

//   const jobs = useMemo<Job[]>(
//     () => (jobPages?.pages ?? []).flatMap((p) => p.data ?? []),
//     [jobPages]
//   )

//   const [shareJob, setShareJob] = useState<Job | null>(null)

//   const [error, setError] = useState<string | null>(null)
//   const [openJobId, setOpenJobId] = useState<string | null>(null)
//   const [filter, setFilter] = useState<Status | "ALL">("ALL")
//   const [currentPage, setCurrentPage] = useState(1)

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     if (fetchError) {
//       setError("Failed to load jobs")
//     } else {
//       setError(null)
//     }
//   }, [fetchError])

//   /* ================= HANDLERS ================= */

//   const handleRefresh = useCallback(async () => {
//     await refetch()
//     router.refresh()
//   }, [refetch, router])

//   const filteredJobs = useMemo(() => {
//     if (filter === "ALL") return jobs
//      if (filter === "ACTIVE") return jobs
//     return jobs.filter((j) => j.status?.toUpperCase() === filter)
//   }, [jobs, filter])

//   // Use backend totalRecords when no client-side filter applied so total is known from first page
//   const backendTotalRecords = jobPages?.pages?.[0]?.pagination?.totalRecords
//   const totalJobs = filter === "ALL" && typeof backendTotalRecords === "number" ? backendTotalRecords : filteredJobs.length
//   const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE))

//   const startIndex = (currentPage - 1) * PAGE_SIZE
//   const paginatedJobs = filteredJobs.slice(startIndex, startIndex + PAGE_SIZE)

//   const handlePageChange = async (page: number) => {
//     if (page < 1 || page > totalPages + (hasNextPage ? 1 : 0)) return

//     const requiredJobs = page * PAGE_SIZE

//     if (requiredJobs > jobs.length && hasNextPage) {
//       // fetch until we have enough jobs loaded for the requested page
//       await fetchNextPage()
//     }

//     setCurrentPage(page)
//     setOpenJobId(null)
//   }

//   /* ================= UI STATES ================= */

//   if (isLoading) {
//     return <div className="p-10 text-center text-gray-500">Loading jobs...</div>
//   }

//   if (error) {
//     return <div className="p-10 text-center text-red-500">{error}</div>
//   }

//   const filters = [
//     { key: "ALL", label: "All Jobs", icon: CheckCircle2 },
//     { key: "ACTIVE", label: "Active", icon: CheckCircle2 },
   
//   ] as const

//   /* ================= RENDER ================= */

//   return (
//     <div className="bg-[#f7f8fb] min-h-screen px-2 py-10">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="flex flex-wrap justify-between items-end gap-4 py-4">
//           <div className="flex min-w-[18rem] flex-col gap-1">
//             <p className="text-[#111218] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//               Job Management
//             </p>
//             <p className="text-[#616889] dark:text-gray-400 text-base">
//               Manage and monitor your active job listings and applicant demographics.
//             </p>
//           </div>

//           <CreateJobButton onJobCreated={handleRefresh} />
//         </div>

//         {/* FILTERS */}
//         <div className="flex gap-3 py-4 flex-wrap overflow-x-auto no-scrollbar">
//           {filters.map((f) => {
//             const Icon = f.icon
//             return (
//               <FilterButton
//                 key={f.key}
//                 label={f.label}
//                 active={filter === f.key}
//                 onClick={() => setFilter(f.key)}
//                 icon={<Icon className="w-4 h-4 opacity-80" />}
//               />
//             )
//           })}
//         </div>

//         {/* JOB LIST */}
//         <div className="space-y-4">
//           {paginatedJobs.map((job) => {
//             const isOpen = openJobId === job._id

//             return (
//               <JobCard
//                 key={job._id}
//                 job={job}
//                 isOpen={isOpen}
//                 onToggle={() => setOpenJobId(isOpen ? null : job._id)}
//                 onEdit={() => router.push(`/admin/jobs/${job._id}/edit`)}
//                 onDelete={handleRefresh}
//                 onShare={() => setShareJob(job)}
//               />
//             )
//           })}
//         </div>

//         {/* PAGINATION */}
//         <PaginationBar
//           currentPage={currentPage}
//           totalItems={totalJobs}
//           pageSize={PAGE_SIZE}
//           hasNextPage={hasNextPage}
//           filterLabel={filter === "ALL" ? "listings" : `${filter.toLowerCase()} listings`}
//           onPageChange={handlePageChange}
//         />
//       </div>
//       <ShareJobModal
//         isOpen={!!shareJob}
//         onClose={() => setShareJob(null)}
//         jobTitle={shareJob?.title ?? ""}
//         jobRef={shareJob?._id ?? ""}
//         applicationUrl={shareJob ? `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${shareJob._id}` : ""}
//         onSave={(settings) => {
//           console.log("Saved share settings:", settings)
//         }}
//       />
//     </div>
//   )
// }

// one more comment
// 
"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, Briefcase } from "lucide-react"

import CreateJobButton from "../ui/CreateJobButton"
import FilterButton from "../ui/FilterButton"
import JobCard from "./JobCard"
import ShareJobModal from "./ShareJobModal"
import { Job } from "@/types/Job"

type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"

export default function Jobs() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data: jobPages,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobsAdmin()

  /* ================= DATA LOGIC ================= */

  const jobs = useMemo<Job[]>(
    () => jobPages?.pages?.flatMap((p: any) => p.data ?? []) ?? [],
    [jobPages]
  )

  const [shareJob, setShareJob] = useState<Job | null>(null)
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | "ALL">("ALL")

  /* ================= INFINITE SCROLL LOGIC ================= */

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root: scrollRef.current, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  /* ================= HANDLERS ================= */

  const handleRefresh = useCallback(async () => {
    await refetch()
    router.refresh()
  }, [refetch, router])

  const filteredJobs = useMemo(() => {
    if (filter === "ALL") return jobs
    return jobs.filter((j) => j.status?.toUpperCase() === filter)
  }, [jobs, filter])

  /* ================= UI STATES ================= */

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (isError) return <div className="h-screen flex items-center justify-center">Error loading jobs</div>

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#f7f8fb] h-screen flex flex-col overflow-hidden px-4 py-10">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 space-y-6">
        
        {/* HEADER & FILTERS COMBINED */}
        <div className="flex flex-col gap-6 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-gray-900">Job Management</h1>
            <p className="text-[#616889]">Manage and monitor your active listings.</p>
          </div>

          {/* This component now holds both the Create button and Filters in one line */}
          <CreateJobButton onJobCreated={handleRefresh}>
            <FilterButton
              label="All Jobs"
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
            <FilterButton
              label="Active"
              active={filter === "ACTIVE"}
              onClick={() => setFilter("ACTIVE")}
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
          </CreateJobButton>
        </div>

        {/* SCROLLABLE JOB LIST */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4"
        >
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-3xl bg-white">
              <Briefcase className="text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 font-medium">No {filter.toLowerCase()} jobs found.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isOpen={openJobId === job._id}
                onToggle={() => setOpenJobId(openJobId === job._id ? null : job._id)}
                onEdit={() => router.push(`/admin/jobs/${job._id}/edit`)}
                onDelete={handleRefresh}
                onShare={() => setShareJob(job)}
              />
            ))
          )}

          {/* Loading Indicator for Infinite Scroll */}
          <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
            {isFetchingNextPage && <Loader2 className="animate-spin text-blue-500" />}
          </div>
        </div>
      </div>

      <ShareJobModal
        isOpen={!!shareJob}
        onClose={() => setShareJob(null)}
        jobTitle={shareJob?.title ?? ""}
        jobRef={shareJob?._id ?? ""}
        applicationUrl={shareJob ? `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${shareJob._id}` : ""}
      />
    </div>
  )
}