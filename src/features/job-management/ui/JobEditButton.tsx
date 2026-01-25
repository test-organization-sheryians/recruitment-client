"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import EditJob from "../components/EditJob"

interface Props {
  jobId: string
  onUpdated: () => void
}

export default function JobEditButton({ jobId, onUpdated }: Props) {
  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  return (
    <>
      <button
        onClick={() => setEditingJobId(jobId)}
        className="h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
      >
        <Pencil size={16} />
        Edit Job
      </button>

      <EditJob
        jobId={editingJobId}
        onClose={() => setEditingJobId(null)}
        onJobUpdated={() => {
          onUpdated()
          setEditingJobId(null)
        }}
      />
    </>
  )
}
