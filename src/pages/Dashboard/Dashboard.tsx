import React, { useState, useEffect, useCallback } from 'react';
import { dashboardMockData } from './mockData';
import { DashboardHeader } from './components/DashboardHeader';
import { RecommendationCard } from './components/RecommendationCard';
import { AlertList } from './components/AlertList';
import { StatusCards } from './components/StatusCards';
import { BorewellVisualization } from './components/BorewellVisualization';
import { WaterEnergyBalance } from './components/WaterEnergyBalance';
import { IrrigationTimeline } from './components/IrrigationTimeline';
import { useLanguage } from '../../i18n/LanguageContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { monitoringService, type FarmReading } from '../../services/monitoring/monitoringService';
import { adviceService, type AdviceResponse } from '../../services/advice/adviceService';
import {
  Trees,
  Sprout,
  CloudRain,
  Droplet,
  Sun,
  Zap,
  ArrowRight,
  Info,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { farmProfile } = useOnboarding();

  const [latestReading, setLatestReading] = useState<FarmReading | null>(null);
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [history, setHistory] = useState<FarmReading[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (refresh: boolean = false) => {
    if (refresh) setIsRefreshing(true);
    setError(null);

    try {
      // 1. Fetch latest reading
      let currentReading: FarmReading | null = null;
      try {
        currentReading = await monitoringService.getLatestReading();
        setLatestReading(currentReading);
      } catch (err: any) {
        // 404 means no readings recorded yet for this user
        setLatestReading(null);
      }

      // 2. Fetch live evaluated advice
      // The backend /api/advice/evaluate automatically merges the user's FarmProfile with their latest reading!
      try {
        const adviceResult = await adviceService.evaluate({});
        setAdvice(adviceResult);
      } catch (_err: any) {
        // May fail if farm profile not created yet or no inputs
        setAdvice(null);
      }

      // 3. Fetch recent history for charts
      try {
        const historyData = await monitoringService.getHistory(10);
        setHistory(historyData);
      } catch (_err) {
        setHistory([]);
      }
    } catch (err: any) {
      setError(err.message || t('Failed to load dashboard data.'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Build live alert list based on real farm state
  const alerts: Array<{ id: string; type: string; message: string }> = [];

  if (latestReading?.is_demo) {
    alerts.push({
      id: 'demo-notice',
      type: 'info',
      message: t('Displaying simulated demo dataset. Record a live field reading in Monitoring to switch to real data.')
    });
  }

  if (latestReading?.soil_moisture_level === 'LOW') {
    alerts.push({
      id: 'soil-low',
      type: 'warning',
      message: t('Low soil moisture detected on your farm. Review recommended irrigation window.')
    });
  }

  if (latestReading?.borewell_water_level === 'LOW') {
    alerts.push({
      id: 'borewell-low',
      type: 'warning',
      message: t('Borewell recovering. Water level near safe limit. Pumping rest cycle advised.')
    });
  }

  if (latestReading?.weather_forecast === 'RAIN') {
    alerts.push({
      id: 'weather-rain',
      type: 'info',
      message: t('Rain expected in local forecast. Irrigation can be postponed.')
    });
  }

  if (error) {
    alerts.push({
      id: 'dashboard-error',
      type: 'warning',
      message: error
    });
  }

  if (!latestReading && !isLoading) {
    alerts.push({
      id: 'no-reading-yet',
      type: 'info',
      message: t('No field readings recorded yet. Add your first reading in Monitoring to see live data.')
    });
  }

  const renderPipelineNode = (Icon: any, label: string) => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-surface border border-border-main flex items-center justify-center shadow-xs">
        <Icon className="w-4 h-4 text-text-secondary" />
      </div>
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:block">
        {t(label)}
      </span>
    </div>
  );

  const renderArrow = () => (
    <ArrowRight className="w-4 h-4 text-border-main flex-shrink-0" />
  );

  return (
    <div className="pb-12 animate-fade-in max-w-7xl mx-auto space-y-6">
      <DashboardHeader />

      {/* Control bar: Refresh & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border-main shadow-xs">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-farm-green inline-block animate-pulse"></span>
          <span>
            {latestReading?.created_at
              ? `${t('Latest observation')}: ${new Date(latestReading.created_at).toLocaleString()}`
              : t('Awaiting first observation')}
          </span>
          {latestReading?.is_demo && (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {t('Demo Mode')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-main bg-bg-main hover:bg-surface text-xs font-medium text-text-secondary transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t('Refreshing...') : t('Refresh')}</span>
          </button>

          <Link
            to="/monitoring"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-farm-green hover:bg-forest text-white text-xs font-medium transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('Record Reading')}</span>
          </Link>
        </div>
      </div>

      {/* Prototype Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-800 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">{t('Prototype Demonstration')}</p>
          <p className="leading-relaxed">
            {t(
              'Values shown are illustrative simulations based on seeded demo data or manual field entries. This prototype is not connected to physical IoT sensors, weather APIs, or verified aquifer hardware.'
            )}
          </p>
        </div>
      </div>

      {/* Live Alerts */}
      <AlertList alerts={alerts} />

      {/* Visual Hierarchy Pipeline */}
      <div className="flex items-center justify-between overflow-x-auto pb-4 px-2 scrollbar-none opacity-85">
        {renderPipelineNode(Trees, 'Crop')}
        {renderArrow()}
        {renderPipelineNode(Sprout, 'Soil')}
        {renderArrow()}
        {renderPipelineNode(CloudRain, 'Weather')}
        {renderArrow()}
        {renderPipelineNode(Droplet, 'Borewell')}
        {renderArrow()}
        {renderPipelineNode(Sun, 'Solar')}
        {renderArrow()}
        {renderPipelineNode(Zap, 'Pump')}
      </div>

      {/* Primary Recommendation Card */}
      <RecommendationCard
        advice={advice}
        reading={latestReading}
        solarPump={farmProfile.solarPump}
        isLoading={isLoading}
      />

      {/* Status Cards */}
      <StatusCards
        data={dashboardMockData.status}
        reading={latestReading}
        isLoading={isLoading}
      />

      {/* Deep-dive analytics and schedule preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col h-full space-y-8">
          <BorewellVisualization
            data={dashboardMockData.borewellChartData}
            reading={latestReading}
            history={history}
          />
          <WaterEnergyBalance reading={latestReading} advice={advice} />
        </div>
        <div className="h-full">
          <IrrigationTimeline
            data={dashboardMockData.schedulePreview}
            advice={advice}
          />
        </div>
      </div>
    </div>
  );
};
