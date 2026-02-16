import React from "react"

type Props = {
  icon: React.ReactNode
  bg: string
  dark?: boolean
  onClick?: () => void
}

export default function ShareButton({
  icon,
  bg,
  dark,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition hover:opacity-90 cursor-pointer ${
        dark ? "text-gray-800 dark:text-white" : "text-white"
      } ${bg}`}
    >
      {icon}
    </button>
  )
}
