import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const HeroImage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border-main/60 h-[200px] lg:h-[clamp(160px,22vh,240px)]">
      <img 
        src="/agricultural_landscape.jpg" 
        alt="Indian agricultural field with solar irrigation" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Subtle overlay only at the bottom for the badge contrast if needed, but glassmorphism handles it */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Glassmorphism Badge */}
      <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/55 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <CheckCircle2 className="w-4 h-4 text-farm-green" />
          <span className="text-[13px] font-semibold text-text-primary tracking-wide">
            {t('Active Monitoring')}
          </span>
        </div>
      </div>
    </div>
  );
};
