import React from 'react'

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  id?: string;
  placeholder: string;
  name?: string;
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(({
  label,
  type,
  id,
  placeholder,
  ...rest
}, ref) => {
  const generatedId = React.useId();
  const _id = id || generatedId;

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={_id}
        className="text-gray-600 text-sm font-medium mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={_id}
        placeholder={placeholder}
        className="
          w-full
          text-sm sm:text-base
          bg-[#DFECFF]
          rounded-base
          px-3 sm:px-4 md:px-5
          py-2 sm:py-2.5 md:py-3
          outline-none
          border border-gray-200 focus:border-blue-400
          transition
        "
        ref={ref}
        {...rest}
      />
    </div>
  )
})

LabelInput.displayName = 'LabelInput';

export default LabelInput;
