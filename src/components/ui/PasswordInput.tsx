import React, { useState } from 'react';
import { FormInput, type FormInputProps } from './FormInput';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative group">
        <FormInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className="pr-12" // Add padding to avoid overlapping the icon
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-[40px] text-text-muted hover:text-text-primary focus:outline-none transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
