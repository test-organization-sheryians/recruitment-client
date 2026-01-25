"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import SwipeableDrawer from "../ui/SwipeableDrawer"
import UpdateJob from "@/features/admin/jobs/components/UpdateJob"

interface Props {
  jobId: string
  onUpdated: () => void
}

export default function JobEditButton({ jobId, onUpdated }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
      >
        <Pencil size={16} />
        Edit Job
      </button>

      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sections={[
          {
            items: [
              {
                text: "",
                icon: (
                  <div className="w-[520px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                      <h2 className="text-lg font-bold text-gray-900">
                        Update Job
                      </h2>
                      <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <UpdateJob
                        jobId={jobId}
                        onJobUpdated={() => {
                          onUpdated()
                          setOpen(false)
                        }}
                      />
                    </div>
                  </div>
                ),
              },
            ],
          },
        ]}
      />
    </>
  )
}
