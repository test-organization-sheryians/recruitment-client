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
  const _id = id || React.useId()

  return (
    <div className="flex flex-col">
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
        className="w-full text-base bg-[#DFECFF] rounded-base px-4 py-2.5 outline-none"
        ref={ref}
        {...rest}
      />
    </div>
  )
})

LabelInput.displayName = 'LabelInput';

export default LabelInput;
