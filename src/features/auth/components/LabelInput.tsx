import React from 'react';

interface LabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;         // made optional + better default
  id?: string;
  placeholder?: string;  // optional, not every input needs it
  name?: string;
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(
  (
    {
      label,
      type = 'text',      
      id,
      placeholder = '',
      className,
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 select-none"
        >
          {label}
        </label>

        <input
          type={type}
          id={inputId}
          placeholder={placeholder}
          ref={ref}
          className={`
            w-full px-4 py-2.5 text-base bg-[#DFECFF] 
            rounded-lg outline-none ring-2 ring-transparent 
            focus:ring-blue-500 focus:bg-white transition-all
            placeholder:text-gray-400
            ${className || ''}
          `}
          {...rest}
        />
      </div>
    );
  }
);

LabelInput.displayName = 'LabelInput';

export default LabelInput;