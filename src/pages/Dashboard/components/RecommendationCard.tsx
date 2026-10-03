import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Droplet, Sun, CloudRain, Activity, AlertTriangle, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RecommendationCardProps {
  data?: {
    status: string;
    title: string;
    reason: string;
    factors: Array<{ id: string; label: string; value: string; icon: string }>;
  };
  advice?: {
    primary_recommendation: string;
    reasons: string[];
    contributing_conditions: string[];
    missing_inputs?: string[];
    suggested_action: string;
    confidence: string;
    timestamp?: string;
  } | null;
  reading?: {
    soil_moisture_level?: string | null;
    borewell_water_level?: string | null;
    solar_availability?: string | null;
    weather_forecast?: string | null;
    is_demo?: boolean;
    created_at?: string;
  } | null;
  solarPump?: string | null;
  isLoading?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  data,
  advice,
  reading,
  solarPump,
  isLoading
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border-main p-8 shadow-sm mb-6 animate-pulse">
        <div className="h-4 bg-border-main rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-border-main rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-border-main rounded w-3/4"></div>
      </div>
    );
  }

  // If no live advice and no legacy data
  if (!advice && !data) {
    return (
      <div className="bg-surface rounded-xl border border-dashed border-border-main p-8 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-solar-amber/10 text-solar-amber rounded-full">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              {t('Awaiting Farm Telemetry')}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              {t('Record your first farm observation in the Monitoring section to receive live, deterministic irrigation and energy recommendations.')}
            </p>
          </div>
        </div>
        <Link
          to="/monitoring"
          className="flex items-center gap-2 px-5 py-2.5 bg-farm-green text-white rounded-xl text-sm font-medium hover:bg-forest transition-colors shadow-sm whitespace-nowrap"
        >
          <span>{t('Go to Monitoring')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Resolve recommendation title, reason, icon, and colors
  let recStatus = 'wait';
  let title = 'Wait before irrigating';
  let reason = '';
  let confidence = '';

  if (advice) {
    confidence = advice.confidence;
    reason = advice.suggested_action || advice.reasons.join(' ');

    switch (advice.primary_recommendation) {
      case 'SOLAR_WINDOW':
        recStatus = 'solar';
        title = 'Solar Pumping Window';
        break;
      case 'IRRIGATION_MAY_BE_NEEDED':
        recStatus = 'irrigate';
        title = 'Irrigation May Be Needed';
        break;
      case 'BOREWELL_RECOVERY':
        recStatus = 'alert';
        title = 'Borewell Recovery Required';
        break;
      case 'RAIN_DELAY':
        recStatus = 'wait';
        title = 'Rain Delay Active';
        break;
      case 'WAIT_BEFORE_IRRIGATING':
        recStatus = 'wait';
        title = 'Wait Before Irrigating';
        break;
      case 'INSUFFICIENT_DATA':
        recStatus = 'alert';
        title = 'Insufficient Data';
        break;
      default:
        recStatus = 'wait';
        title = advice.primary_recommendation.replace(/_/g, ' ');
    }
  } else if (data) {
    recStatus = data.status;
    title = data.title;
    reason = data.reason;
  }

  const isWait = recStatus === 'wait';
  const isIrrigate = recStatus === 'irrigate';
  const isSolar = recStatus === 'solar';

  const headerBg = isSolar
    ? 'bg-solar-amber/10 text-solar-amber'
    : isWait
    ? 'bg-solar-amber/10 text-solar-amber'
    : isIrrigate
    ? 'bg-water-blue/10 text-water-blue'
    : 'bg-warning/10 text-warning';

  const Icon = isSolar ? Sun : isWait ? Clock : isIrrigate ? Droplet : AlertTriangle;

  // Resolve factors
  let factors: Array<{ id: string; label: string; value: string; icon: string }> = [];

  if (advice && reading) {
    const moistureVal =
      reading.soil_moisture_level === 'LOW'
        ? 'Low (Dry)'
        : reading.soil_moisture_level === 'MEDIUM'
        ? 'Medium (Optimal)'
        : reading.soil_moisture_level === 'HIGH'
        ? 'High (Wet)'
        : 'Not measured';

    const rainVal =
      reading.weather_forecast === 'RAIN'
        ? 'Rain Expected'
        : reading.weather_forecast === 'CLEAR'
        ? 'Clear / Sunny'
        : reading.weather_forecast === 'OVERCAST'
        ? 'Cloudy'
        : 'Not recorded';

    const borewellVal =
      reading.borewell_water_level === 'LOW'
        ? 'Low (Resting)'
        : reading.borewell_water_level === 'ADEQUATE'
        ? 'Adequate'
        : 'Not recorded';

    const solarVal =
      reading.solar_availability === 'HIGH'
        ? 'High (Peak)'
        : reading.solar_availability === 'LOW'
        ? 'Low'
        : 'Not recorded';

    const pumpVal = solarPump === 'yes' ? 'Solar Pump' : 'Grid / Other';

    factors = [
      { id: 'soil', label: 'Soil Moisture', value: moistureVal, icon: 'soil' },
      { id: 'rain', label: 'Weather Forecast', value: rainVal, icon: 'rain' },
      { id: 'borewell', label: 'Borewell Level', value: borewellVal, icon: 'borewell' },
      { id: 'solar', label: 'Solar Availability', value: solarVal, icon: 'solar' },
      { id: 'pump', label: 'Pump Source', value: pumpVal, icon: 'pump' },
    ];
  } else if (data) {
    factors = data.factors;
  }

  const getFactorIcon = (iconId: string) => {
    switch (iconId) {
      case 'soil':
        return <Activity className="w-4 h-4 text-farm-green" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-water-blue" />;
      case 'borewell':
        return <Droplet className="w-4 h-4 text-water-blue" />;
      case 'solar':
        return <Sun className="w-4 h-4 text-solar-amber" />;
      case 'pump':
        return <Zap className="w-4 h-4 text-solar-amber" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-farm-green" />;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border-main shadow-sm overflow-hidden mb-6 flex flex-col md:flex-row">
      {/* Left side - Action */}
      <div
        className={`p-8 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-main ${headerBg}`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              {t('AquaVolt Recommendation')}
            </span>
            {confidence && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface/80 border border-current shadow-xs">
                {t('Confidence')}: {t(confidence)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <Icon className="w-9 h-9 flex-shrink-0" />
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">{t(title)}</h2>
          </div>
          <p className="text-sm opacity-95 leading-relaxed font-medium">
            {t(reason)}
          </p>
        </div>

        {advice?.timestamp && (
          <div className="mt-4 pt-3 border-t border-current/20 text-xs opacity-75">
            {t('Evaluated at')}: {new Date(advice.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Right side - Contributing Conditions & Factors */}
      <div className="p-6 md:w-7/12 bg-bg-main flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('Contributing Conditions')}
            </h3>
            {reading?.is_demo && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                {t('Simulated Demo Data')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {factors.map((factor) => (
              <div
                key={factor.id}
                className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border-main shadow-2xs"
              >
                <div className="mt-0.5 p-1 rounded bg-bg-main">{getFactorIcon(factor.icon)}</div>
                <div className="min-w-0">
                  <div className="text-xs text-text-secondary truncate">{t(factor.label)}</div>
                  <div className="text-sm font-semibold text-text-primary truncate">
                    {t(factor.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {advice?.reasons && advice.reasons.length > 1 && (
            <div className="mt-2 p-3 bg-surface rounded-lg border border-border-main text-xs text-text-secondary space-y-1">
              <span className="font-semibold text-text-primary">{t('Engine Insights')}:</span>
              {advice.reasons.slice(1).map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-farm-green">•</span>
                  <span>{t(r)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {reading?.created_at && (
          <div className="text-xs text-text-muted mt-4 pt-2 border-t border-border-main/50 flex justify-between items-center">
            <span>
              {t('Based on reading from')}: {new Date(reading.created_at).toLocaleString()}
            </span>
            <Link
              to="/advice"
              className="text-farm-green hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>{t('View in AI Advice')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
