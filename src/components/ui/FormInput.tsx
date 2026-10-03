import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full flex flex-col space-y-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`
              flex h-[50px] lg:h-[52px] w-full rounded-xl border bg-white px-4 py-2 text-[15px]
              text-text-primary transition-all duration-200 file:border-0 file:bg-transparent 
              file:text-sm file:font-medium placeholder:text-text-muted/60 
              focus:outline-none focus:ring-[3px] focus:ring-farm-green/20 focus:border-farm-green
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-warning focus:ring-warning/20 focus:border-warning' : 'border-[#D8E1D9] hover:border-text-muted/40'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-warning mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-text-muted mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
