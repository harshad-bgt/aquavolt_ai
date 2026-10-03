import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-farm-green text-white hover:bg-[#285d32] hover:-translate-y-[1px] hover:shadow-md focus:ring-farm-green',
      secondary: 'bg-bg-secondary text-text-primary hover:bg-[#E2E8E0] hover:-translate-y-[1px] focus:ring-bg-secondary',
      outline: 'border-2 border-border-main text-text-primary hover:bg-bg-main focus:ring-border-main',
      ghost: 'text-text-primary hover:bg-bg-secondary focus:ring-border-main',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-[50px] lg:h-[52px] px-6 text-[15px]',
      lg: 'h-[54px] lg:h-[56px] px-8 text-base',
    };

    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
