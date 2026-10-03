import React from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { MapPin, Sprout, Calendar } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { farmProfile } = useOnboarding();
  const { t } = useLanguage();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface p-6 rounded-xl border border-border-main shadow-sm mb-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary">
          {farmProfile.farmName || t('My Farm')}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-farm-green" />
            <span>{farmProfile.location || t('Location unknown')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-farm-green" />
            <span>{farmProfile.crop || t('No crop set')} • {farmProfile.growthStage || t('Unknown stage')}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-lg border border-border-main text-text-secondary text-sm font-medium">
        <Calendar className="w-4 h-4 text-farm-green" />
        <span>{today}</span>
      </div>
    </div>
  );
};
