import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../i18n/LanguageContext';
import { monitoringService } from '../../services/monitoring/monitoringService';
import type { FarmReading } from '../../services/monitoring/monitoringService';
import { Activity, Droplet, Sun, Wind, Clock } from 'lucide-react';

export default function Monitoring() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [latestReading, setLatestReading] = useState<FarmReading | null>(null);
  
  // Form state
  const [soilMoisture, setSoilMoisture] = useState<string>('');
  const [soilTemp, setSoilTemp] = useState<string>('');
  const [borewellLevel, setBorewellLevel] = useState<string>('');
  const [pumpStatus, setPumpStatus] = useState<string>('');
  const [pumpRuntime, setPumpRuntime] = useState<string>('');
  const [solar, setSolar] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [rainfall, setRainfall] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const data = await monitoringService.getLatestReading();
      setLatestReading(data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch latest reading:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDemo: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data: FarmReading = {
        soil_moisture_level: soilMoisture || null,
        soil_temperature: soilTemp ? parseFloat(soilTemp) : null,
        borewell_water_level: borewellLevel || null,
        pump_status: pumpStatus || null,
        pump_runtime_hours: pumpRuntime ? parseFloat(pumpRuntime) : null,
        solar_availability: solar || null,
        weather_forecast: weather || null,
        rainfall_mm: rainfall ? parseFloat(rainfall) : null,
        is_demo: isDemo
      };
      
      const newReading = await monitoringService.createReading(data);
      setLatestReading(newReading);
      setSuccess(t('Data saved successfully'));
      
      // Reset form
      setSoilMoisture(''); setSoilTemp(''); setBorewellLevel('');
      setPumpStatus(''); setPumpRuntime(''); setSolar('');
      setWeather(''); setRainfall('');
    } catch (err) {
      setError(t('Failed to save data. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDemoScenario = (scenario: string) => {
    if (scenario === 'low_moisture') {
      setSoilMoisture('LOW');
      setBorewellLevel('ADEQUATE');
      setSolar('HIGH');
      setWeather('CLEAR');
    } else if (scenario === 'recovering') {
      setSoilMoisture('MEDIUM');
      setBorewellLevel('LOW');
      setSolar('HIGH');
      setWeather('CLEAR');
    } else if (scenario === 'rain_expected') {
      setSoilMoisture('MEDIUM');
      setBorewellLevel('ADEQUATE');
      setSolar('LOW');
      setWeather('RAIN');
    }
  };

  const formatValue = (val: any, unit: string) => {
    if (val === null || val === undefined) return t('Not available');
    return `${val} ${unit}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-primary-100 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-primary-50 rounded"></div>
              <div className="h-20 bg-primary-50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('Farm Monitoring')}</h1>
        <p className="text-gray-500 mt-1">{t('View current conditions and log manual measurements.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Conditions Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('Current Conditions')}</h2>
          
          {!latestReading ? (
            <Card className="p-6 text-center text-gray-500">
              {t('No readings available. Please add new measurements.')}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Header Info */}
              <div className="col-span-1 sm:col-span-2 flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(latestReading.created_at!).toLocaleString()}</span>
                </div>
                {latestReading.is_demo && (
                  <Badge variant="warning">{t('Demo Data')}</Badge>
                )}
              </div>

              <Card className="p-4 flex flex-col space-y-2">
                <div className="flex items-center text-primary-600">
                  <Droplet className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t('Soil & Moisture')}</span>
                </div>
                <div className="text-sm">
                  <p><span className="text-gray-500">{t('Moisture')}:</span> {latestReading.soil_moisture_level ? t(latestReading.soil_moisture_level) : t('Not available')}</p>
                  <p><span className="text-gray-500">{t('Temperature')}:</span> {formatValue(latestReading.soil_temperature, '°C')}</p>
                </div>
              </Card>

              <Card className="p-4 flex flex-col space-y-2">
                <div className="flex items-center text-blue-600">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t('Borewell & Pump')}</span>
                </div>
                <div className="text-sm">
                  <p><span className="text-gray-500">{t('Water Level')}:</span> {latestReading.borewell_water_level ? t(latestReading.borewell_water_level) : t('Not available')}</p>
                  <p><span className="text-gray-500">{t('Pump Status')}:</span> {latestReading.pump_status ? t(latestReading.pump_status) : t('Not available')}</p>
                  <p><span className="text-gray-500">{t('Runtime')}:</span> {formatValue(latestReading.pump_runtime_hours, 'hrs')}</p>
                </div>
              </Card>

              <Card className="p-4 flex flex-col space-y-2">
                <div className="flex items-center text-yellow-500">
                  <Sun className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t('Solar')}</span>
                </div>
                <div className="text-sm">
                  <p><span className="text-gray-500">{t('Availability')}:</span> {latestReading.solar_availability ? t(latestReading.solar_availability) : t('Not available')}</p>
                </div>
              </Card>

              <Card className="p-4 flex flex-col space-y-2">
                <div className="flex items-center text-gray-600">
                  <Wind className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{t('Weather')}</span>
                </div>
                <div className="text-sm">
                  <p><span className="text-gray-500">{t('Forecast')}:</span> {latestReading.weather_forecast ? t(latestReading.weather_forecast) : t('Not available')}</p>
                  <p><span className="text-gray-500">{t('Rainfall')}:</span> {formatValue(latestReading.rainfall_mm, 'mm')}</p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Manual Entry Form */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{t('Log Measurements')}</h2>
            
            {/* Demo Options */}
            <div className="flex space-x-2">
              <button onClick={() => loadDemoScenario('low_moisture')} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Demo: Dry</button>
              <button onClick={() => loadDemoScenario('recovering')} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Demo: Recovery</button>
            </div>
          </div>
          
          <Card className="p-6">
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Soil Moisture')}</label>
                  <select value={soilMoisture} onChange={(e) => setSoilMoisture(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                    <option value="">{t('Select...')}</option>
                    <option value="LOW">{t('LOW')}</option>
                    <option value="MEDIUM">{t('MEDIUM')}</option>
                    <option value="HIGH">{t('HIGH')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Soil Temp (°C)')}</label>
                  <input type="number" step="0.1" value={soilTemp} onChange={(e) => setSoilTemp(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="e.g. 25.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Borewell Level')}</label>
                  <select value={borewellLevel} onChange={(e) => setBorewellLevel(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                    <option value="">{t('Select...')}</option>
                    <option value="LOW">{t('LOW')}</option>
                    <option value="ADEQUATE">{t('ADEQUATE')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Pump Status')}</label>
                  <select value={pumpStatus} onChange={(e) => setPumpStatus(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                    <option value="">{t('Select...')}</option>
                    <option value="ON">{t('ON')}</option>
                    <option value="OFF">{t('OFF')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Solar Availability')}</label>
                  <select value={solar} onChange={(e) => setSolar(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                    <option value="">{t('Select...')}</option>
                    <option value="LOW">{t('LOW')}</option>
                    <option value="HIGH">{t('HIGH')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Weather Forecast')}</label>
                  <select value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                    <option value="">{t('Select...')}</option>
                    <option value="CLEAR">{t('CLEAR')}</option>
                    <option value="OVERCAST">{t('OVERCAST')}</option>
                    <option value="RAIN">{t('RAIN')}</option>
                  </select>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}

              <div className="flex space-x-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? t('Saving...') : t('Save Measurements')}
                </Button>
                <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
                  {t('Save as Demo')}
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {t('Leave fields empty if no data is available.')}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
