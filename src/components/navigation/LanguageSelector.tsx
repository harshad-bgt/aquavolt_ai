import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { languages } from '../../i18n/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLanguage = languages.find(l => l.code === language) || languages[0];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset focus when opened
  useEffect(() => {
    if (isOpen) {
      const activeIndex = languages.findIndex(l => l.code === language);
      setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
    }
  }, [isOpen, language]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (code: typeof language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % languages.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + languages.length) % languages.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < languages.length) {
          handleSelect(languages[focusedIndex].code);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-farm-green/50"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Change language, currently ${selectedLanguage.name}`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{selectedLanguage.name}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border-main py-1 z-50 overflow-hidden"
          role="listbox"
          aria-label="Select language"
        >
          {languages.map((lang, index) => {
            const isSelected = lang.code === language;
            const isFocused = index === focusedIndex;
            return (
              <div
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  isFocused ? 'bg-bg-secondary' : 'hover:bg-bg-secondary/50'
                } ${isSelected ? 'text-farm-green font-medium bg-farm-green/5' : 'text-text-primary'}`}
                onClick={() => handleSelect(lang.code)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span>{lang.name}</span>
                {isSelected && <Check className="w-4 h-4 text-farm-green" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
