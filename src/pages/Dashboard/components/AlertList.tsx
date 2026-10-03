import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Info, AlertTriangle } from 'lucide-react';

interface AlertListProps {
  alerts: Array<{ id: string; type: string; message: string }>;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  const { t } = useLanguage();

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {alerts.map((alert) => {
        const isWarning = alert.type === 'warning';
        const bgColor = isWarning ? 'bg-warning/10 border-warning/30' : 'bg-water-blue/10 border-water-blue/30';
        const textColor = isWarning ? 'text-warning' : 'text-water-blue';
        const Icon = isWarning ? AlertTriangle : Info;

        return (
          <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor}`}>
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${textColor}`} />
            <div>
              <p className={`text-sm font-medium ${textColor}`}>
                {t(alert.message)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
