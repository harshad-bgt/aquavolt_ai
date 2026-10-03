import { Card } from '../components/ui/Card';

import { Link } from 'react-router-dom';

const createPlaceholder = (title: string, description: string) => {
  return () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-2">{description}</p>
      </div>
      
      <Card padding="lg" className="bg-surface shadow-sm border border-border-main flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-secondary text-text-muted mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-text-primary">Under Construction</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            This module is part of the future AquaVolt AI platform. It is currently acting as a structural placeholder.
          </p>
        </div>
      </Card>
    </div>
  );
};

export const Borewell = createPlaceholder('Borewell Analytics', 'Monitor water levels and pump health.');
export const Soil = createPlaceholder('Soil & Crop', 'Track soil moisture and crop growth stages.');
export const Energy = createPlaceholder('Solar & Energy', 'Manage your solar capacity and battery usage.');
export const Weather = createPlaceholder('Weather Forecast', 'Hyper-local agricultural weather insights.');
export const Schedule = createPlaceholder('Irrigation Schedule', 'Automated and manual watering schedules.');
export const Alerts = createPlaceholder('Alerts & Notifications', 'Important system and farm warnings.');
export const History = createPlaceholder('Farm History', 'Historical data and seasonal performance.');

export const Farm = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Farm Profile</h1>
        <p className="text-text-secondary mt-2">Manage your onboarding setup and field configurations.</p>
      </div>
      <Link 
        to="/onboarding" 
        className="px-4 py-2 bg-farm-green text-white rounded-md font-medium shadow-sm hover:bg-dark-green transition-colors"
      >
        Edit Farm Profile
      </Link>
    </div>
    
    <Card padding="lg" className="bg-surface shadow-sm border border-border-main flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-medium text-text-primary">Farm Details</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Click the "Edit Farm Profile" button above to modify your SQLite-backed farm data.
        </p>
      </div>
    </Card>
  </div>
);

export const Settings = createPlaceholder('Settings', 'Account preferences and system configuration.');
