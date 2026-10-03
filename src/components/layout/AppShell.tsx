import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isPinned, setIsPinned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main text-text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full relative z-30">
        <Sidebar isPinned={isPinned} setIsPinned={setIsPinned} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full w-72 flex-col bg-surface shadow-xl">
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-secondary hover:text-text-primary"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* We force mobile sidebar to be expanded */}
          <Sidebar isPinned={true} setIsPinned={() => {}} isMobile={true} className="w-full border-r-0" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border-main">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Logo collapsed={true} />
          <div className="w-6" /> {/* Spacer for centering logo */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
