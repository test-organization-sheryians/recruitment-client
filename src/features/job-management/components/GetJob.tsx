"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi"
import { useRouter } from "next/navigation"
import { Archive, CheckCheck, CheckCircle2, ChevronDown, Edit3 } from "lucide-react"

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
     if (filter === "ACTIVE") return jobs
    return jobs.filter((j) => j.status?.toUpperCase() === filter)
  }, [jobs, filter])

  // Use backend totalRecords when no client-side filter applied so total is known from first page
  const backendTotalRecords = jobPages?.pages?.[0]?.pagination?.totalRecords
  const totalJobs = filter === "ALL" && typeof backendTotalRecords === "number" ? backendTotalRecords : filteredJobs.length
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE))

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages + (hasNextPage ? 1 : 0)) return

    const requiredJobs = page * PAGE_SIZE

    if (requiredJobs > jobs.length && hasNextPage) {
      // fetch until we have enough jobs loaded for the requested page
      await fetchNextPage()
    }

    setCurrentPage(page)
    setOpenJobId(null)
  }

  /* ================= UI STATES ================= */

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading jobs...</div>
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  const filters = [
    { key: "ALL", label: "All Jobs", icon: CheckCircle2 },
    { key: "ACTIVE", label: "Active", icon: CheckCircle2 },
   
  ] as const

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#f7f8fb] min-h-screen px-2 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4 py-4">
          <div className="flex min-w-[18rem] flex-col gap-1">
            <p className="text-[#111218] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Job Management
            </p>
            <p className="text-[#616889] dark:text-gray-400 text-base">
              Manage and monitor your active job listings and applicant demographics.
            </p>
          </div>

          <CreateJobButton onJobCreated={handleRefresh} />
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 py-4 flex-wrap overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const Icon = f.icon
            return (
              <FilterButton
                key={f.key}
                label={f.label}
                active={filter === f.key}
                onClick={() => setFilter(f.key)}
                icon={<Icon className="w-4 h-4 opacity-80" />}
              />
            )
          })}
        </div>

        {/* JOB LIST */}
        <div className="space-y-4">
          {paginatedJobs.map((job) => {
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
          })}
        </div>

        {/* PAGINATION */}
        <PaginationBar
          currentPage={currentPage}
          totalItems={totalJobs}
          pageSize={PAGE_SIZE}
          hasNextPage={hasNextPage}
          filterLabel={filter === "ALL" ? "listings" : `${filter.toLowerCase()} listings`}
          onPageChange={handlePageChange}
        />
      </div>
      <ShareJobModal
        isOpen={!!shareJob}
        onClose={() => setShareJob(null)}
        jobTitle={shareJob?.title ?? ""}
        jobRef={shareJob?._id ?? ""}
        applicationUrl={shareJob ? `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${shareJob._id}` : ""}
        onSave={(settings) => {
          console.log("Saved share settings:", settings)
        }}
      />
    </div>
  )
}
