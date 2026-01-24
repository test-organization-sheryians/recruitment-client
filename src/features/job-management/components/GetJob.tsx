"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import CreateJob from "@/features/admin/jobs/components/CreateJob"
import DeleteJob from "@/features/admin/jobs/components/DeleteJob"
import UpdateJob from "@/features/admin/jobs/components/UpdateJob"
import { useRouter } from "next/navigation"
import { Archive, CheckCircle2, ChevronDown, Edit3, PlusIcon } from "lucide-react"
import CreateJobButton from "../ui/CreateJobButton"
import FilterButton from "../ui/FilterButton"

type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"

export default function Jobs() {
  const router = useRouter()

  const {
    data: jobPages,
    isLoading,
    error: fetchError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobsAdmin()

  const jobs = (jobPages?.pages ?? []).flatMap((p) => p.data ?? [])

  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | "ALL">("ALL")

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (fetchError) setError("Failed to load jobs")
    else setError(null)
  }, [fetchError])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleRefresh = useCallback(async () => {
    await refetch()
    router.refresh()
    setIsCreateDialogOpen(false)
    setIsUpdateDialogOpen(false)
    setEditingJobId(null)
  }, [refetch, router])

  const filteredJobs = useMemo(() => {
    if (filter === "ALL") return jobs
    return jobs.filter((j: any) => j.status?.toUpperCase() === filter)
  }, [jobs, filter])

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading jobs...</div>
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  const statusStyles = (status: Status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "INTERVIEWING":
        return "bg-blue-100 text-blue-700"
      case "DRAFT":
        return "bg-gray-200 text-gray-700"
      case "FILLED":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const filters = [
    { key: "ALL", label: "All Jobs", icon: ChevronDown },
    { key: "ACTIVE", label: "Active", icon: CheckCircle2 },
    { key: "DRAFT", label: "Draft", icon: Edit3 },
    { key: "FILLED", label: "Filled", icon: Archive },
  ]

  return (
    <div className="bg-[#f7f8fb] min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4 p-4">
          {/* LEFT */}
          <div className="flex min-w-[18rem] flex-col gap-1">
            <p className="text-[#111218] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Job Management
            </p>
            <p className="text-[#616889] dark:text-gray-400 text-base font-normal leading-normal">
              Manage and monitor your active job listings and applicant demographics.
            </p>
          </div>

          {/* RIGHT */}
          <CreateJobButton onJobCreated={handleRefresh} />
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 p-4 flex-wrap overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const Icon = f.icon

            return (
              <FilterButton
                key={f.key}
                label={f.label}
                active={filter === f.key}
                onClick={() => setFilter(f.key as any)}
                icon={Icon ? <Icon className="w-4 h-4 opacity-80" /> : null}
              />
            )
          })}
        </div>

        {/* JOB LIST */}
        <div className="space-y-4">
          {filteredJobs.map((job: any) => {
            const isOpen = openJobId === job._id
            const status = (job.status?.toUpperCase() || "ACTIVE") as Status

            const visibleSkills = job.skills?.slice(0, 4) || []
            const extraSkills = job.skills?.slice(4) || []

            return (
              <div
                key={job._id}
                className={`bg-white rounded-xl border transition-all ${
                  isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
              >
                {/* ROW */}
                <button
                  onClick={() => setOpenJobId(isOpen ? null : job._id)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wide ${statusStyles(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.category?.name || "General"} •{" "}
                      {job.createdAt
                        ? `Posted ${new Date(job.createdAt).toLocaleDateString()}`
                        : "Recently"}
                    </p>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">{job.applicantsCount || 0}</p>
                      <p className="text-xs uppercase text-gray-500">Applicants</p>
                    </div>

                    <span
                      className={`material-symbols-outlined text-2xl text-blue-600 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown />
                    </span>
                  </div>
                </button>

                {/* EXPANDED */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-4 bg-gray-50 rounded-b-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <span className="material-symbols-outlined text-blue-600">
                            psychology
                          </span>
                          Required Skills
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {visibleSkills.map((s: any, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-full bg-white border text-xs font-semibold"
                            >
                              {typeof s === "string" ? s : s.name}
                            </span>
                          ))}
                          {extraSkills.length > 0 && (
                            <span className="text-blue-600 text-xs font-bold cursor-pointer">
                              +{extraSkills.length} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <span className="material-symbols-outlined text-blue-600">
                            description
                          </span>
                          Job Description
                        </h4>
                        <div className="mt-2 bg-white border rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
                          {job.description}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                        <span className="material-symbols-outlined text-blue-600">settings</span>
                        Management Actions
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setIsUpdateDialogOpen(true)
                            setEditingJobId(job._id)
                          }}
                          className="h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          Edit Job
                        </button>

                        <button
                          onClick={() => router.push(`/admin/jobs/${job._id}/questions`)}
                          className="h-11 rounded-lg border bg-white font-semibold hover:bg-gray-100 transition"
                        >
                          Questions
                        </button>

                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/jobs/${job._id}`
                            )
                          }
                          className="h-11 rounded-lg border bg-white font-semibold hover:bg-gray-100 transition"
                        >
                          Share Link
                        </button>

                        <DeleteJob
                          jobId={job._id}
                          onJobDeleted={handleRefresh}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPDATE DIALOG */}
                <Dialog
                  open={isUpdateDialogOpen && editingJobId === job._id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsUpdateDialogOpen(false)
                      setEditingJobId(null)
                    }
                  }}
                >
                  <DialogContent className="w-full h-[95vh]">
                    <DialogHeader>
                      <DialogTitle>Update Job</DialogTitle>
                    </DialogHeader>
                    <UpdateJob
                      jobId={job._id}
                      onJobUpdated={handleRefresh}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )
          })}

          {/* Infinite Scroll */}
          <div
            ref={loadMoreRef}
            className="h-2"
          />

          {isFetchingNextPage && (
            <div className="text-center text-sm text-gray-500 py-4">Loading more jobs...</div>
          )}
        </div>
      </div>
    </div>
  )
}
