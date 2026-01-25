"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  currentPage: number
  totalItems: number
  pageSize: number
  hasNextPage: boolean
  filterLabel?: string
  onPageChange: (page: number) => void
}

export default function PaginationBar({
  currentPage,
  totalItems,
  pageSize,
  hasNextPage,
  filterLabel = "listings",
  onPageChange,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  return (
    <div className="flex items-center justify-between py-6 px-2 text-sm text-gray-600">
      {/* LEFT TEXT */}
      <p>
        Showing{" "}
        <span className="font-semibold">
          {totalItems === 0 ? 0 : startIndex + 1}
        </span>
        –
        <span className="font-semibold">
          {Math.min(endIndex, totalItems)}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalItems}
        </span>{" "}
        {filterLabel}
      </p>

      {/* CONTROLS */}
      <div className="flex items-center gap-2">
        {/* PREV */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 rounded border flex items-center justify-center disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1
          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded border flex items-center justify-center text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }
              `}
            >
              {page}
            </button>
          )
        })}

        {/* NEXT */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage && currentPage >= totalPages}
          className="h-9 w-9 rounded border flex items-center justify-center disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
