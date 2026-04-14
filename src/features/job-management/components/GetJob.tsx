"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi"
import { useRouter } from "next/navigation"
import { Archive, CheckCheck, CheckCircle2, ChevronDown, Edit3, Briefcase } from "lucide-react"

import CreateJobButton from "../ui/CreateJobButton"
import FilterButton from "../ui/FilterButton"
import JobCard from "./JobCard"
import PaginationBar from "./PaginationBar"

import { Job } from "@/types/Job"
import ShareJobModal from "./ShareJobModal"

/* ================= TYPES ================= */

type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"

const PAGE_SIZE = 10

export default function Jobs() {
  const router = useRouter()

  const {
    data: jobPages,
    isLoading,
    error: fetchError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteJobsAdmin()

  const jobs = useMemo<Job[]>(
    () => (jobPages?.pages ?? []).flatMap((p) => p.data ?? []),
    [jobPages]
  )

  const [shareJob, setShareJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | "ALL">("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (fetchError) {
      setError("Failed to load jobs")
    } else {
      setError(null)
    }
  }, [fetchError])

  /* ================= HANDLERS ================= */

  const handleRefresh = useCallback(async () => {
    await refetch()
    router.refresh()
  }, [refetch, router])

  const filteredJobs = useMemo(() => {
    if (filter === "ALL") return jobs
    return jobs.filter((j) => j.status?.toUpperCase() === filter)
  }, [jobs, filter])

  const backendTotalRecords = jobPages?.pages?.[0]?.pagination?.totalRecords
  const totalJobs = filter === "ALL" && typeof backendTotalRecords === "number" ? backendTotalRecords : filteredJobs.length
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE))

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages + (hasNextPage ? 1 : 0)) return

    const requiredJobs = page * PAGE_SIZE
    if (requiredJobs > jobs.length && hasNextPage) {
      await fetchNextPage()
    }

    setCurrentPage(page)
    setOpenJobId(null)
  }

  /* ================= RENDER ================= */

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fb]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fb]">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button onClick={handleRefresh} className="mt-4 text-blue-600 underline">Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f8fb] rounded-xl min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-80px)]">
        
        {/* HEADER - Remains Static */}
        <div className="flex flex-wrap justify-between items-end gap-4 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Job Management
            </h1>
            <p className="text-[#616889] text-sm">
              Manage and monitor your active job listings and applicant demographics.
            </p>
          </div>
          <CreateJobButton onJobCreated={handleRefresh} />
        </div>

        {/* SCROLLABLE JOB LIST AREA */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => {
                const isOpen = openJobId === job._id
                return (
                  <JobCard
                    key={job._id}
                    job={job}
                    isOpen={isOpen}
                    onToggle={() => setOpenJobId(isOpen ? null : job._id)}
                    onEdit={() => router.push(`/admin/jobs/${job._id}/edit`)}
                    onDelete={handleRefresh}
                    onShare={() => setShareJob(job)}
                  />
                )
              })
            ) : (
              <div className="py-20 text-center text-gray-400">
                No jobs found.
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION - Stays at bottom */}
        <div className="pt-6">
          <PaginationBar
            currentPage={currentPage}
            totalItems={totalJobs}
            pageSize={PAGE_SIZE}
            hasNextPage={hasNextPage}
            filterLabel={filter === "ALL" ? "listings" : `${filter.toLowerCase()} listings`}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <ShareJobModal
        isOpen={!!shareJob}
        onClose={() => setShareJob(null)}
        jobTitle={shareJob?.title ?? ""}
        jobRef={shareJob?._id ?? ""}
        applicationUrl={shareJob ? `${process.env.NEXT_PUBLIC_URL}/jobs/${shareJob._id}` : ""}
        onSave={(settings) => console.log("Saved:", settings)}
      />

      {/* INLINE STYLES FOR SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}