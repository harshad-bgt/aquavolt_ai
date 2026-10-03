import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { defaultLanguage, translations } from './translations';
import type { LanguageCode } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem('aquavolt_language') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('aquavolt_language', lang);
      document.documentElement.lang = lang; // Accessibility
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations[defaultLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
