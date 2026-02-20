type Props = {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

export default function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-[#111218] dark:text-white">
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2
          ${checked ? "bg-[#1D4ED8]" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white
            shadow-md ring-0 transition-transform duration-300 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  )
}
