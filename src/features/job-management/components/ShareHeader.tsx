import { X } from "lucide-react"

type Props = {
  title: string
  jobRef: string
  onClose: () => void
}

export default function ShareHeader({
  title,
  jobRef,
  onClose,
}: Props) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-[#f0f1f4] dark:border-gray-800">
      <div>
        <h3 className="text-xl font-extrabold text-[#111218] dark:text-white">
          Share Job Application
        </h3>
        <p className="text-sm text-[#616889] dark:text-gray-400">
          {title} (Ref: {jobRef})
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  )
}
