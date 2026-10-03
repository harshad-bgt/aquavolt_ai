import React from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { FarmReading } from '../../../services/monitoring/monitoringService';

interface BorewellVisualizationProps {
  data: Array<{ time: string; level: number; predicted?: boolean }>;
  reading?: FarmReading | null;
  history?: FarmReading[];
}

export const BorewellVisualization: React.FC<BorewellVisualizationProps> = ({ data, reading, history: _history }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface p-6 rounded-xl border border-border-main shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{t('Farm Borewell Recovery Cycle')}</h3>
          <p className="text-sm text-text-secondary mt-1">
            {t('Estimated water level relative to pump depth. Prevents over-extraction.')}
          </p>
        </div>

        {reading?.borewell_water_level && (
          <div className="flex items-center gap-1.5 self-start">
            <span className="text-xs text-text-secondary">{t('Current Status')}:</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                reading.borewell_water_level === 'LOW'
                  ? 'bg-warning/10 text-warning border border-warning/30'
                  : 'bg-farm-green/10 text-farm-green border border-farm-green/30'
              }`}
            >
              {reading.borewell_water_level === 'LOW' ? t('Low (Needs Recovery)') : t('Adequate')}
            </span>
          </div>
        )}
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#176B87" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#176B87" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis
              reversed={true} // Lower level is deeper (higher number)
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value || 0} ft`, t('Depth')]}
            />
            <ReferenceLine
              y={250}
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{
                position: 'insideTopLeft',
                value: t('Safe Pumping Limit'),
                fill: '#EF4444',
                fontSize: 12,
              }}
            />

            <Area
              type="monotone"
              dataKey="level"
              stroke="#176B87"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorLevel)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border-main/50 text-xs text-text-secondary">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-water-blue rounded-full"></div>
            <span>{t('Measured')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-water-blue border-dashed rounded-full"></div>
            <span>{t('Predicted Recovery')}</span>
          </div>
        </div>

        <span className="text-text-muted italic">
          {t('Illustrative simulated recovery curve for prototype demonstration')}
        </span>
      </div>
    </div>
  );
};
