import React from 'react';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', collapsed = false }) => {
  return (
    <div className={`flex items-center text-farm-green ${className}`} aria-label="AquaVolt AI Logo">
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill="#F5F7F2" />
        
        {/* Water Drop Base */}
        <path d="M20 10C20 10 12 18 12 26C12 30.4183 15.5817 34 20 34C24.4183 34 28 30.4183 28 26C28 18 20 10 20 10Z" fill="#176B87" />
        
        {/* Leaf Overlay */}
        <path d="M20 34C15.5817 34 12 30.4183 12 26C12 21 17 14 20 10C20 10 20 14 17 18C14 22 17 29 20 34Z" fill="#2F6B3B" />
        
        {/* Solar/Lightning Core */}
        <path d="M22 15L17 23H20L19 29L25 19H21L22 15Z" fill="#D99A22" />
      </svg>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-36 opacity-100 ml-3'}`}>
        <span className="text-2xl font-semibold tracking-tight text-text-primary whitespace-nowrap">
          AquaVolt AI
        </span>
      </div>
    </div>
  );
};
