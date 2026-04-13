"use client"

import { useRouter } from "next/navigation"
import { FileQuestionMark } from "lucide-react"

interface Props {
  jobId: string
}

export default function JobQuestionsButton({ jobId }: Props) {
  const router = useRouter()

  return (
    <button
      // onClick={() => router.push(`/admin/jobs/${jobId}/questions`)}
      onClick={() => router.push(`/admin/screen/${jobId}`)}
      className="h-11 rounded-lg border bg-white font-semibold hover:bg-gray-100 transition flex justify-center items-center gap-2 cursor-pointer"
    >
      <FileQuestionMark size={16} />
      Questions
    </button>
  )
}
