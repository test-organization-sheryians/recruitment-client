"use client"

import { Share2 } from "lucide-react"

type Props = {
  onClick: () => void
}

export default function JobShareButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold cursor-pointer"
    >
      <Share2 size={16} />
      Share
    </button>
  )
}
