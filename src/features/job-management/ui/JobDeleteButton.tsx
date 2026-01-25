"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import SwipeableDrawer from "../ui/SwipeableDrawer"
import DeleteJob from "@/features/admin/jobs/components/DeleteJob"

interface Props {
  jobId: string
  onDeleted: () => void
}

export default function JobDeleteButton({ jobId, onDeleted }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-11 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition flex justify-center items-center gap-2 font-bold"
      >
        <Trash size={16} />
        Delete
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
                  <div className="w-[420px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                      <h2 className="text-lg font-bold text-red-600">
                        Delete Job
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
                      <DeleteJob
                        jobId={jobId}
                        onJobDeleted={() => {
                          onDeleted()
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
