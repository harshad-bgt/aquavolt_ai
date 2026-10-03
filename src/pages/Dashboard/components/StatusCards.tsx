import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Droplet, Sun, CloudRain, Sprout, Zap, ArrowDown } from 'lucide-react';
import type { FarmReading } from '../../../services/monitoring/monitoringService';

interface StatusCardsProps {
  data?: any;
  reading?: FarmReading | null;
  isLoading?: boolean;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ data, reading, isLoading }) => {
  const { t } = useLanguage();
  const { farmProfile } = useOnboarding();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-border-main h-48"></div>
        ))}
      </div>
    );
  }

  // Derive Soil status
  let moistureDisplay = t('Not recorded');
  let moistureBadge = null;

  if (reading?.soil_moisture_level) {
    if (reading.soil_moisture_level === 'LOW') {
      moistureDisplay = t('Low');
      moistureBadge = (
        <div className="flex items-center text-warning text-xs font-semibold bg-warning/10 px-2 py-1 rounded">
          <ArrowDown className="w-3 h-3 mr-1" />
          <span>{t('Dry (Needs Water)')}</span>
        </div>
      );
    } else if (reading.soil_moisture_level === 'MEDIUM') {
      moistureDisplay = t('Optimal');
      moistureBadge = (
        <div className="flex items-center text-farm-green text-xs font-semibold bg-farm-green/10 px-2 py-1 rounded">
          <span>{t('Adequate')}</span>
        </div>
      );
    } else if (reading.soil_moisture_level === 'HIGH') {
      moistureDisplay = t('High');
      moistureBadge = (
        <div className="flex items-center text-water-blue text-xs font-semibold bg-water-blue/10 px-2 py-1 rounded">
          <span>{t('Wet (Wait)')}</span>
        </div>
      );
    }
  } else if (data?.soil?.percentage) {
    moistureDisplay = `${data.soil.percentage}%`;
    moistureBadge = (
      <div className="flex items-center text-warning text-xs font-semibold bg-warning/10 px-2 py-1 rounded">
        <ArrowDown className="w-3 h-3 mr-1" />
        <span>{t('Drying')}</span>
      </div>
    );
  }

  // Derive Borewell status
  let borewellStatus = t('Not recorded');
  if (reading?.borewell_water_level) {
    borewellStatus =
      reading.borewell_water_level === 'LOW'
        ? t('Low (Needs recovery)')
        : t('Adequate');
  } else if (data?.borewell?.status) {
    borewellStatus = t(data.borewell.status);
  }

  // Derive Solar & Pump
  let solarDisplay = t('Not recorded');
  if (reading?.solar_availability) {
    solarDisplay =
      reading.solar_availability === 'HIGH'
        ? t('High (Peak Sunlight)')
        : t('Low (Overcast/Evening)');
  } else if (data?.solar?.availability) {
    solarDisplay = t(data.solar.availability);
  }

  const pumpStatusDisplay =
    reading?.pump_status === 'ON'
      ? t('ON (Active)')
      : reading?.pump_status === 'OFF'
      ? t('OFF (Idle)')
      : data?.pump?.status
      ? t(data.pump.status)
      : t('OFF');

  const pumpRuntimeDisplay =
    reading?.pump_runtime_hours != null
      ? `${reading.pump_runtime_hours} ${t('hrs')}`
      : '0.0 hrs';

  // Weather
  let weatherForecastDisplay = t('Not recorded');
  if (reading?.weather_forecast) {
    weatherForecastDisplay =
      reading.weather_forecast === 'RAIN'
        ? t('Rain Expected')
        : reading.weather_forecast === 'CLEAR'
        ? t('Clear / Sunny')
        : t('Cloudy / Overcast');
  } else if (data?.weather?.rainfall) {
    weatherForecastDisplay = t(data.weather.rainfall);
  }

  const rainfallDisplay =
    reading?.rainfall_mm != null
      ? `${reading.rainfall_mm} mm`
      : data?.weather?.rainProbability
      ? data.weather.rainProbability
      : '0.0 mm';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {/* Soil & Crop */}
      <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-farm-green">
              <Sprout className="w-5 h-5" />
              <h3 className="font-semibold text-text-primary">{t('Soil & Crop')}</h3>
            </div>
            {reading?.is_demo && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {t('Demo Data')}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider">{t('Moisture Level')}</div>
                <div className="text-2xl font-bold text-text-primary mt-1">{moistureDisplay}</div>
              </div>
              {moistureBadge}
            </div>

            <div className="pt-4 border-t border-border-main grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-text-secondary">{t('Crop')}</div>
                <div className="text-sm font-semibold text-text-primary truncate">
                  {farmProfile.crop || t('Not set')}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">{t('Growth Stage')}</div>
                <div className="text-sm font-medium text-text-secondary truncate">
                  {farmProfile.growthStage || t('Vegetative')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border-main/50 text-xs text-text-muted flex justify-between">
          <span>{t('Soil Temp')}: {reading?.soil_temperature != null ? `${reading.soil_temperature}°C` : t('Not recorded')}</span>
          <span>{farmProfile.irrigationMethod ? t(farmProfile.irrigationMethod) : t('Drip / Furrow')}</span>
        </div>
      </div>

      {/* Borewell */}
      <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-water-blue">
              <Droplet className="w-5 h-5" />
              <h3 className="font-semibold text-text-primary">{t('Borewell')}</h3>
            </div>
            {reading?.borewell_water_level === 'LOW' ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/30">
                {t('Resting')}
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-farm-green/10 text-farm-green border border-farm-green/30">
                {t('Safe Level')}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider">{t('Status')}</div>
                <div className="text-xl font-bold text-water-blue mt-1">{borewellStatus}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-secondary">{t('Water Source')}</div>
                <div className="text-sm font-semibold text-text-primary mt-1 capitalize">
                  {farmProfile.waterSource ? t(farmProfile.waterSource) : t('Borewell')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-main grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-text-secondary">{t('Pump Depth')}</div>
                <div className="text-sm font-medium text-text-primary">
                  {farmProfile.borewellDepth ? `${farmProfile.borewellDepth} ft` : t('Not specified')}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">{t('Condition')}</div>
                <div className="text-sm font-medium text-text-secondary">
                  {reading?.borewell_water_level === 'LOW'
                    ? t('Recharge Cycle')
                    : t('Ready to Pump')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border-main/50 text-xs text-text-muted">
          <span>{t('Prevents borewell dry run and aquifer strain')}</span>
        </div>
      </div>

      {/* Solar & Energy */}
      <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-solar-amber">
              <Sun className="w-5 h-5" />
              <h3 className="font-semibold text-text-primary">{t('Solar & Pump')}</h3>
            </div>
            {farmProfile.solarPump === 'yes' ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-solar-amber/10 text-solar-amber border border-solar-amber/30">
                {t('Solar Pump')}
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border-main">
                {t('Grid / Diesel')}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider">{t('Solar Availability')}</div>
                <div className="text-xl font-bold text-solar-amber mt-1">{solarDisplay}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-secondary">{t('Pump Status')}</div>
                <div className="text-sm font-bold text-text-primary mt-1 flex items-center justify-end gap-1">
                  <Zap className="w-3.5 h-3.5 text-solar-amber" />
                  {pumpStatusDisplay}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-main grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-text-secondary">{t('Recorded Runtime')}</div>
                <div className="text-sm font-semibold text-text-primary">{pumpRuntimeDisplay}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">{t('Pump Capacity')}</div>
                <div className="text-sm font-medium text-text-secondary">
                  {farmProfile.pumpCapacity ? `${farmProfile.pumpCapacity} HP` : t('5 HP')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border-main/50 text-xs text-text-muted">
          <span>{t('Optimizes irrigation for free solar generation')}</span>
        </div>
      </div>

      {/* Weather */}
      <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm md:col-span-2 xl:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <CloudRain className="w-5 h-5 text-water-blue" />
            <h3 className="font-semibold text-text-primary">{t('Local Weather & Forecast')}</h3>
          </div>
          <span className="text-xs text-text-muted">
            {farmProfile.location || t('Maharashtra')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-3 bg-bg-main rounded-lg border border-border-main">
            <div className="text-xs text-text-secondary">{t('Forecast')}</div>
            <div className="text-xl font-bold text-text-primary mt-1">{weatherForecastDisplay}</div>
          </div>
          <div className="p-3 bg-bg-main rounded-lg border border-border-main">
            <div className="text-xs text-text-secondary">{t('Rainfall Recorded')}</div>
            <div className="text-xl font-bold text-water-blue mt-1">{rainfallDisplay}</div>
          </div>
          <div className="p-3 bg-bg-main rounded-lg border border-border-main">
            <div className="text-xs text-text-secondary">{t('Soil / Field Temp')}</div>
            <div className="text-xl font-bold text-text-primary mt-1">
              {reading?.soil_temperature != null ? `${reading.soil_temperature}°C` : '28°C (est.)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
