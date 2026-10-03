import React from 'react';
import { Droplet, Sun, Trees } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ProductHighlights: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 pt-5 lg:pt-6 border-t border-border-main/50">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-water-blue/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-water-blue/10 mt-0.5">
          <Droplet className="w-4 h-4 text-water-blue" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[13px] lg:text-[14px] font-bold text-text-primary tracking-wide">{t('WATER')}</h3>
          <p className="text-[12px] lg:text-[13px] text-text-secondary leading-tight">{t('Smart borewell-aware irrigation decisions')}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-solar-amber/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-solar-amber/10 mt-0.5">
          <Sun className="w-4 h-4 text-solar-amber" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[13px] lg:text-[14px] font-bold text-text-primary tracking-wide">{t('ENERGY')}</h3>
          <p className="text-[12px] lg:text-[13px] text-text-secondary leading-tight">{t('Better use of available solar energy')}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-farm-green/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-farm-green/10 mt-0.5">
          <Trees className="w-4 h-4 text-farm-green" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[13px] lg:text-[14px] font-bold text-text-primary tracking-wide">{t('CROP')}</h3>
          <p className="text-[12px] lg:text-[13px] text-text-secondary leading-tight">{t('Crop and soil-aware irrigation planning')}</p>
        </div>
      </div>
    </div>
  );
};
