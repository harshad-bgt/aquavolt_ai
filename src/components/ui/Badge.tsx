import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'neutral', children, ...props }, ref) => {
    const variants = {
      success: 'bg-[#E3F2E7] text-farm-green',
      warning: 'bg-[#FEF5E7] text-solar-amber',
      info: 'bg-[#E5F1F6] text-water-blue',
      error: 'bg-[#FBEBEA] text-warning',
      neutral: 'bg-bg-secondary text-text-secondary',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
