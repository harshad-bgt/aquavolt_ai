import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { AdviceResponse } from '../../../services/advice/adviceService';

interface IrrigationTimelineProps {
  data?: Array<{ period: string; action: string; reason: string }>;
  advice?: AdviceResponse | null;
}

export const IrrigationTimeline: React.FC<IrrigationTimelineProps> = ({ data, advice }) => {
  const { t } = useLanguage();

  let schedule = data || [];

  if (advice) {
    switch (advice.primary_recommendation) {
      case 'SOLAR_WINDOW':
        schedule = [
          {
            period: 'Morning (6 AM - 10 AM)',
            action: 'Prepare Field',
            reason: 'Solar generation ramping up; verify field valves and emitters.'
          },
          {
            period: 'Midday (10 AM - 3 PM)',
            action: 'Solar Window Active',
            reason: 'Peak solar generation and dry soil. Optimal window to irrigate.'
          },
          {
            period: 'Evening (3 PM - 6 PM)',
            action: 'Pump Idle',
            reason: 'Allow borewell aquifer rest and prevent night waterlogging.'
          }
        ];
        break;
      case 'WAIT_BEFORE_IRRIGATING':
        schedule = [
          {
            period: 'Morning (6 AM - 12 PM)',
            action: 'Wait',
            reason: 'Soil moisture is currently adequate for crop stage.'
          },
          {
            period: 'Afternoon (12 PM - 6 PM)',
            action: 'Wait',
            reason: 'No water deficit detected in root zone.'
          },
          {
            period: 'Evening (6 PM - 12 AM)',
            action: 'Monitor',
            reason: 'Recheck soil reading tomorrow morning.'
          }
        ];
        break;
      case 'RAIN_DELAY':
        schedule = [
          {
            period: 'Morning (6 AM - 12 PM)',
            action: 'Hold Pumping',
            reason: 'Rain predicted in regional forecast; conserve energy and water.'
          },
          {
            period: 'Afternoon (12 PM - 6 PM)',
            action: 'Rain Expected',
            reason: 'Allow natural precipitation to nourish root zone.'
          },
          {
            period: 'Evening (6 PM - 12 AM)',
            action: 'Field Inspection',
            reason: 'Verify soil saturation after precipitation event.'
          }
        ];
        break;
      case 'BOREWELL_RECOVERY':
        schedule = [
          {
            period: 'Morning (6 AM - 12 PM)',
            action: 'Pause Pumping',
            reason: 'Borewell water level is low; prevent dry run damage.'
          },
          {
            period: 'Afternoon (12 PM - 6 PM)',
            action: 'Recovery Cycle',
            reason: 'Aquifer recharge in progress. Pumping strictly paused.'
          },
          {
            period: 'Evening (6 PM - 12 AM)',
            action: 'Check Recovery',
            reason: 'Inspect water column level before scheduling next run.'
          }
        ];
        break;
      case 'IRRIGATION_MAY_BE_NEEDED':
        schedule = [
          {
            period: 'Morning (6 AM - 10 AM)',
            action: 'Irrigation Window',
            reason: 'Dry soil detected; pump during cool morning hours.'
          },
          {
            period: 'Afternoon (10 AM - 4 PM)',
            action: 'Rest Cycle',
            reason: 'Avoid high evaporation losses during peak heat.'
          },
          {
            period: 'Evening (4 PM - 8 PM)',
            action: 'Secondary Check',
            reason: 'Assess moisture infiltration across field.'
          }
        ];
        break;
      default:
        schedule = [
          {
            period: 'Morning (6 AM - 12 PM)',
            action: 'Record Reading',
            reason: 'Add field observation in Monitoring.'
          },
          {
            period: 'Afternoon (12 PM - 6 PM)',
            action: 'Evaluate Advice',
            reason: 'Check AI Advice for customized recommendations.'
          },
          {
            period: 'Evening (6 PM - 12 AM)',
            action: 'Schedule Plan',
            reason: 'Dynamic plan updates automatically with new readings.'
          }
        ];
    }
  }

  return (
    <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm h-full">
      <h3 className="text-lg font-semibold text-text-primary mb-6">{t('Today’s Irrigation Plan')}</h3>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-main before:to-transparent">
        {schedule.map((item, index) => {
          const lowerAction = item.action.toLowerCase();
          const isWait = lowerAction.includes('wait') || lowerAction.includes('hold');
          const isRain = lowerAction.includes('rain');
          const isRecover = lowerAction.includes('recover') || lowerAction.includes('pause');
          const isSolar = lowerAction.includes('solar');
          const isIrrigate = lowerAction.includes('irrigate');

          let colorClass = 'bg-farm-green border-farm-green';
          let textClass = 'text-farm-green';

          if (isSolar) {
            colorClass = 'bg-solar-amber border-solar-amber';
            textClass = 'text-solar-amber';
          } else if (isWait) {
            colorClass = 'bg-solar-amber border-solar-amber';
            textClass = 'text-solar-amber';
          } else if (isRain) {
            colorClass = 'bg-water-blue border-water-blue';
            textClass = 'text-water-blue';
          } else if (isRecover) {
            colorClass = 'bg-warning border-warning';
            textClass = 'text-warning';
          } else if (isIrrigate) {
            colorClass = 'bg-water-blue border-water-blue';
            textClass = 'text-water-blue';
          }

          return (
            <div
              key={index}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div
                className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-surface ${colorClass} absolute left-0 md:left-1/2 -translate-x-1/2 z-10 shadow-sm`}
              />

              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-border-main bg-bg-main shadow-xs ml-8 md:ml-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {t(item.period)}
                  </span>
                </div>
                <div className={`text-lg font-bold mb-1 ${textClass}`}>{t(item.action)}</div>
                <div className="text-sm text-text-secondary">{t(item.reason)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
