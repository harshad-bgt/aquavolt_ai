import React, { useState } from 'react';
import { adviceService, type CurrentConditions, type AdviceResponse } from '../../services/advice/adviceService';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AlertCircle, CheckCircle2, Clock, CloudRain, Sun, Droplet } from 'lucide-react';

export const Advice: React.FC = () => {
  const { t } = useLanguage();
  const [conditions, setConditions] = useState<CurrentConditions>({
    soil_moisture_level: '',
    weather_forecast: '',
    borewell_water_level: '',
    solar_availability: ''
  });
  
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConditions(prev => ({
      ...prev,
      [e.target.name]: e.target.value || null
    }));
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Clean up empty strings to null
      const payload: CurrentConditions = {
        soil_moisture_level: conditions.soil_moisture_level || null,
        weather_forecast: conditions.weather_forecast || null,
        borewell_water_level: conditions.borewell_water_level || null,
        solar_availability: conditions.solar_availability || null,
      };
      
      const result = await adviceService.evaluate(payload);
      setAdvice(result);
    } catch (err: any) {
      setError(err.message || t('Failed to generate advice. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WAIT_BEFORE_IRRIGATING': return <Clock className="w-6 h-6 text-blue-500" />;
      case 'IRRIGATION_MAY_BE_NEEDED': return <Droplet className="w-6 h-6 text-water-blue" />;
      case 'BOREWELL_RECOVERY': return <AlertCircle className="w-6 h-6 text-warning" />;
      case 'RAIN_DELAY': return <CloudRain className="w-6 h-6 text-blue-600" />;
      case 'SOLAR_WINDOW': return <Sun className="w-6 h-6 text-solar-amber" />;
      case 'INSUFFICIENT_DATA': return <AlertCircle className="w-6 h-6 text-gray-500" />;
      default: return <CheckCircle2 className="w-6 h-6 text-farm-green" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    return category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('AI Advice')}</h1>
        <p className="text-text-secondary">{t('Get practical irrigation and energy recommendations based on your farm profile and current conditions.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Conditions Form */}
        <Card padding="lg" className="space-y-5">
          <h2 className="text-lg font-semibold text-text-primary">{t('Current Conditions')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('Soil Moisture')}</label>
              <select 
                name="soil_moisture_level" 
                value={conditions.soil_moisture_level || ''} 
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8E1D9] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/20 focus:border-farm-green"
              >
                <option value="">{t('Unknown / Not measured')}</option>
                <option value="LOW">{t('Low (Dry)')}</option>
                <option value="MEDIUM">{t('Medium (Optimal)')}</option>
                <option value="HIGH">{t('High (Wet)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('Weather Forecast')}</label>
              <select 
                name="weather_forecast" 
                value={conditions.weather_forecast || ''} 
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8E1D9] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/20 focus:border-farm-green"
              >
                <option value="">{t('Unknown')}</option>
                <option value="CLEAR">{t('Clear / Sunny')}</option>
                <option value="OVERCAST">{t('Cloudy / Overcast')}</option>
                <option value="RAIN">{t('Rain expected')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('Borewell Level')}</label>
              <select 
                name="borewell_water_level" 
                value={conditions.borewell_water_level || ''} 
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8E1D9] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/20 focus:border-farm-green"
              >
                <option value="">{t('Unknown')}</option>
                <option value="LOW">{t('Low (Needs recovery)')}</option>
                <option value="ADEQUATE">{t('Adequate')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('Solar Availability')}</label>
              <select 
                name="solar_availability" 
                value={conditions.solar_availability || ''} 
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8E1D9] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/20 focus:border-farm-green"
              >
                <option value="">{t('Unknown')}</option>
                <option value="LOW">{t('Low (Early morning/Evening/Cloudy)')}</option>
                <option value="HIGH">{t('High (Peak daytime)')}</option>
              </select>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleEvaluate} 
                isLoading={isLoading}
              >
                {t('Generate Advice')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Panel */}
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-[#FBEBEA] border border-[#F5C2C0] rounded-xl" role="alert">
              <p className="text-sm text-warning font-medium">{error}</p>
            </div>
          )}

          {!advice && !error && !isLoading && (
            <Card padding="lg" className="h-full flex flex-col items-center justify-center text-center py-12 text-text-secondary border-dashed bg-transparent border-2 border-border-main/60">
              <AlertCircle className="w-12 h-12 text-border-main mb-4" />
              <p>{t('Provide current farm conditions to receive practical irrigation and energy recommendations.')}</p>
            </Card>
          )}

          {advice && (
            <Card padding="lg" className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface border border-border-main rounded-full shadow-sm">
                  {getCategoryIcon(advice.primary_recommendation)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {t(getCategoryTitle(advice.primary_recommendation))}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t('Confidence')}: <span className="font-medium text-text-primary">{t(advice.confidence)}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-farm-green/5 p-4 rounded-xl border border-farm-green/10">
                <h4 className="text-sm font-bold text-text-primary mb-2">{t('Suggested Action')}</h4>
                <p className="text-text-primary">{t(advice.suggested_action)}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-primary mb-2">{t('Reasons')}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {advice.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-text-secondary">{t(r)}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-primary mb-2">{t('Contributing Data')}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {advice.contributing_conditions.map((c, i) => (
                    <li key={i} className="text-sm text-text-secondary">{c}</li>
                  ))}
                </ul>
              </div>

              {advice.missing_inputs && advice.missing_inputs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-warning mb-2">{t('Missing Data')}</h4>
                  <p className="text-sm text-text-secondary mb-1">
                    {t('The following data was not provided, which may limit the accuracy of this recommendation:')}
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {advice.missing_inputs.map((m, i) => (
                      <li key={i} className="text-sm text-text-secondary capitalize">{t(m.replace(/_/g, ' '))}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-xs text-text-muted text-right pt-2 border-t border-border-main/30">
                {t('Generated at')} {new Date(advice.timestamp).toLocaleTimeString()}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
