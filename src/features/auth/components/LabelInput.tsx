import React from 'react'

interface LabelInputIntern {
  label: string;
  type: string;
  id: string;
  placeholder: string;
}

const LabelInput = ({
  label,
  type,
  id,
  placeholder
}: LabelInputIntern) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="email"
        className="text-gray-600 text-sm font-medium mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full text-base bg-[#DFECFF] rounded-base px-4 py-2.5 outline-none"
      />
    </div>
  )
}

export default LabelInput
