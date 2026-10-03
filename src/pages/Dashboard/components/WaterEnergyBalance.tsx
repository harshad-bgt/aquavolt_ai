import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ArrowRight, Plus, Equal } from 'lucide-react';
import type { FarmReading } from '../../../services/monitoring/monitoringService';
import type { AdviceResponse } from '../../../services/advice/adviceService';

interface WaterEnergyBalanceProps {
  reading?: FarmReading | null;
  advice?: AdviceResponse | null;
}

export const WaterEnergyBalance: React.FC<WaterEnergyBalanceProps> = ({ reading, advice }) => {
  const { t } = useLanguage();

  // Resolve factors from live reading
  const soilNeedLabel =
    reading?.soil_moisture_level === 'LOW'
      ? t('High (Dry)')
      : reading?.soil_moisture_level === 'HIGH'
      ? t('Low (Wet)')
      : reading?.soil_moisture_level === 'MEDIUM'
      ? t('Moderate')
      : t('Moderate');

  const soilNeedColor =
    reading?.soil_moisture_level === 'LOW'
      ? 'text-warning'
      : reading?.soil_moisture_level === 'HIGH'
      ? 'text-water-blue'
      : 'text-farm-green';

  const solarLabel =
    reading?.solar_availability === 'HIGH'
      ? t('Peak Sun')
      : reading?.solar_availability === 'LOW'
      ? t('Low / Cloud')
      : t('Available');

  const solarColor =
    reading?.solar_availability === 'HIGH' ? 'text-solar-amber' : 'text-text-secondary';

  const borewellLabel =
    reading?.borewell_water_level === 'LOW'
      ? t('Recovering')
      : reading?.borewell_water_level === 'ADEQUATE'
      ? t('Adequate')
      : t('Adequate');

  const borewellColor =
    reading?.borewell_water_level === 'LOW' ? 'text-warning' : 'text-water-blue';

  const weatherLabel =
    reading?.weather_forecast === 'RAIN'
      ? t('Rain Expected')
      : reading?.weather_forecast === 'CLEAR'
      ? t('Clear')
      : reading?.weather_forecast === 'OVERCAST'
      ? t('Cloudy')
      : t('Clear');

  const weatherColor =
    reading?.weather_forecast === 'RAIN' ? 'text-water-blue' : 'text-text-primary';

  // Resolve recommendation pill
  let recLabel = t('Wait');
  let recClass = 'bg-solar-amber/10 border-solar-amber text-solar-amber';

  if (advice) {
    switch (advice.primary_recommendation) {
      case 'SOLAR_WINDOW':
        recLabel = t('Solar Window');
        recClass = 'bg-solar-amber/10 border-solar-amber text-solar-amber';
        break;
      case 'WAIT_BEFORE_IRRIGATING':
        recLabel = t('Wait');
        recClass = 'bg-solar-amber/10 border-solar-amber text-solar-amber';
        break;
      case 'BOREWELL_RECOVERY':
        recLabel = t('Recovery');
        recClass = 'bg-warning/10 border-warning text-warning';
        break;
      case 'RAIN_DELAY':
        recLabel = t('Rain Delay');
        recClass = 'bg-water-blue/10 border-water-blue text-water-blue';
        break;
      case 'IRRIGATION_MAY_BE_NEEDED':
        recLabel = t('Irrigate');
        recClass = 'bg-water-blue/10 border-water-blue text-water-blue';
        break;
      case 'INSUFFICIENT_DATA':
        recLabel = t('Need Data');
        recClass = 'bg-bg-secondary border-border-main text-text-secondary';
        break;
      default:
        recLabel = String(advice.primary_recommendation).replace(/_/g, ' ');
    }
  } else if (!reading) {
    recLabel = t('Pending Data');
    recClass = 'bg-bg-secondary border-border-main text-text-muted';
  }

  return (
    <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">{t('How AquaVolt Decides')}</h3>
        <p className="text-sm text-text-secondary mt-1">
          {t('A simple view of the factors driving today’s irrigation recommendation.')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
        {/* Factors */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-4 flex-1">
          <div className="flex flex-col items-center p-3 bg-farm-green/5 rounded-lg border border-farm-green/20 w-24 text-center">
            <span className="text-xs text-text-secondary mb-1">{t('Crop Need')}</span>
            <span className={`text-sm font-semibold truncate w-full ${soilNeedColor}`}>{soilNeedLabel}</span>
          </div>
          <Plus className="w-4 h-4 text-text-muted flex-shrink-0" />
          <div className="flex flex-col items-center p-3 bg-solar-amber/5 rounded-lg border border-solar-amber/20 w-24 text-center">
            <span className="text-xs text-text-secondary mb-1">{t('Solar')}</span>
            <span className={`text-sm font-semibold truncate w-full ${solarColor}`}>{solarLabel}</span>
          </div>
          <Plus className="w-4 h-4 text-text-muted flex-shrink-0" />
          <div className="flex flex-col items-center p-3 bg-water-blue/5 rounded-lg border border-water-blue/20 w-24 text-center">
            <span className="text-xs text-text-secondary mb-1">{t('Borewell')}</span>
            <span className={`text-sm font-semibold truncate w-full ${borewellColor}`}>{borewellLabel}</span>
          </div>
          <Plus className="w-4 h-4 text-text-muted flex-shrink-0" />
          <div className="flex flex-col items-center p-3 bg-text-secondary/5 rounded-lg border border-border-main w-24 text-center">
            <span className="text-xs text-text-secondary mb-1">{t('Weather')}</span>
            <span className={`text-sm font-semibold truncate w-full ${weatherColor}`}>{weatherLabel}</span>
          </div>
        </div>

        {/* Result */}
        <div className="hidden md:flex flex-shrink-0 text-text-muted px-4">
          <Equal className="w-6 h-6" />
        </div>
        <div className="md:hidden flex flex-shrink-0 text-text-muted py-2">
          <ArrowRight className="w-6 h-6 rotate-90" />
        </div>

        <div
          className={`flex flex-col items-center p-4 rounded-xl border w-full md:w-auto md:min-w-[160px] text-center ${recClass}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
            {t('Recommendation')}
          </span>
          <span className="text-lg font-bold truncate max-w-[200px]">{recLabel}</span>
        </div>
      </div>
    </div>
  );
};
