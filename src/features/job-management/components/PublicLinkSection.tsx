"use client"

import { useState } from "react"
import { Link2, Copy, Check } from "lucide-react"

type Props = {
  url: string
}

export default function PublicLinkSection({ url }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-[#111218] dark:text-white">
        Public Application Link
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={url}
            readOnly
            className="w-full bg-[#f6f6f8] dark:bg-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none text-[#111218] dark:text-white"
          />
        </div>

        <button
          onClick={handleCopy}
          className={`px-5 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition ${
            copied
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#1D4ED8] hover:bg-blue-700"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
