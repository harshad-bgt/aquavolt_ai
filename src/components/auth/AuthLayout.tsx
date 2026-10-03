import React from 'react';
import { Logo } from '../ui/Logo';
import { LanguageSelector } from '../navigation/LanguageSelector';
import { ProductHighlights } from './ProductHighlights';
import { HeroImage } from './HeroImage';
import { useLanguage } from '../../i18n/LanguageContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] bg-[#F3F6F1] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_30%,rgba(47,107,59,0.04),transparent_50%)] pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] h-full flex flex-col lg:flex-row">
        
        {/* Mobile Header (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex items-center justify-between p-4 sm:p-6 bg-surface/80 backdrop-blur-md border-b border-border-main sticky top-0 z-50">
          <Logo />
          <LanguageSelector />
        </div>

        {/* Left Hero (55-60%) */}
        <div className="lg:w-[55%] xl:w-[58%] flex flex-col justify-center px-6 py-8 sm:px-12 lg:px-12 xl:px-20 h-auto lg:h-full">
          <div className="max-w-2xl mx-auto w-full flex flex-col justify-center h-full">
            {/* Desktop Logo */}
            <div className="hidden lg:block mb-6 lg:mb-8 flex-shrink-0">
              <Logo />
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <p className="text-xs sm:text-sm font-bold tracking-widest text-farm-green uppercase">
                {t('SMART AGRICULTURE PLATFORM')}
              </p>
              
              <h1 className="text-[clamp(36px,3.5vw,56px)] font-bold text-text-primary leading-[1.05] tracking-tight">
                {t('Smart Water.')}<br />
                {t('Smart Energy.')}<br />
                <span className="text-forest-green">{t('Sustainable Farming.')}</span>
              </h1>
              
              <p className="text-[15px] sm:text-base text-text-secondary leading-relaxed max-w-[500px]">
                {t('AquaVolt brings crop, soil, water, borewell and solar intelligence together to help farmers make better irrigation decisions.')}
              </p>
            </div>

            <div className="flex-shrink-0 mt-6 lg:mt-8">
              <ProductHighlights />
            </div>
            
            <div className="flex-shrink-0 mt-6 lg:mt-8">
              <HeroImage />
            </div>
          </div>
        </div>

        {/* Right Form Container (40-45%) */}
        <div className="lg:w-[45%] xl:w-[42%] flex flex-col items-center justify-center px-4 py-8 sm:p-12 lg:p-8 xl:p-12 relative h-auto lg:h-full">
          
          {/* Desktop Language Selector */}
          <div className="hidden lg:flex items-center justify-end absolute top-6 right-8 lg:top-8 lg:right-12 z-50 w-full pr-12">
             <LanguageSelector />
          </div>

          <div className="w-full max-w-[440px] mx-auto mt-4 lg:mt-0">
            {/* Glass Form Card */}
            <div className="bg-white/80 backdrop-blur-[18px] border border-white/75 shadow-[0_20px_60px_rgba(0,0,0,0.04)] rounded-[24px] p-6 sm:p-8 lg:p-[min(40px,4vh)]">
              {children}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
