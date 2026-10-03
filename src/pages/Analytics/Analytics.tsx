import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../i18n/LanguageContext';
import { monitoringService } from '../../services/monitoring/monitoringService';
import type { FarmReading } from '../../services/monitoring/monitoringService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Droplet, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [readings, setReadings] = useState<FarmReading[]>([]);
  const [timeFilter, setTimeFilter] = useState<number | null>(7); // 7, 30, or null
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // We pass limit=1000 to get a good chunk of history for charts
      const data = await monitoringService.getHistory(1000, timeFilter || undefined);
      // Sort ascending for charts (API returns descending)
      setReadings(data.reverse());
    } catch (err: any) {
      setError(t('Failed to load analytics data.'));
    } finally {
      setLoading(false);
    }
  };

  // Helper to map string moisture to a number for charting
  const moistureLevelMap: Record<string, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };

  // Calculate Summary Metrics
  const totalObservations = readings.length;
  const latestReading = totalObservations > 0 ? readings[readings.length - 1] : null;
  const totalRuntime = readings.reduce((acc, curr) => acc + (curr.pump_runtime_hours || 0), 0);

  // Moisture Trend Insight
  const getMoistureTrend = () => {
    if (readings.length < 2) return t('Insufficient data to establish a trend.');
    
    // valid moisture readings
    const validReadings = readings.filter(r => r.soil_moisture_level);
    if (validReadings.length < 2) return t('Insufficient moisture data.');

    const first = moistureLevelMap[validReadings[0].soil_moisture_level as string];
    const last = moistureLevelMap[validReadings[validReadings.length - 1].soil_moisture_level as string];

    if (last > first) return t('Soil moisture has generally increased over this period.');
    if (last < first) return t('Soil moisture has generally decreased over this period.');
    return t('Soil moisture has remained relatively stable.');
  };

  // Borewell Recovery Insight
  const getRecoveryInsight = () => {
    const validLevels = readings.filter(r => r.borewell_water_level);
    if (validLevels.length < 3) return t('Insufficient data for recovery analysis.');
    
    // Check if there was any instance of LOW moving to ADEQUATE
    let recoveredCount = 0;
    for (let i = 1; i < validLevels.length; i++) {
      if (validLevels[i-1].borewell_water_level === 'LOW' && validLevels[i].borewell_water_level === 'ADEQUATE') {
        recoveredCount++;
      }
    }

    if (recoveredCount > 0) {
      return t('Recent readings show a recorded recovery pattern.');
    }
    return t('No clear recovery pattern observed in recent records.');
  };

  // Prepare chart data
  const chartData = readings.map(r => {
    const date = new Date(r.created_at!);
    return {
      time: `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:00`,
      timestamp: date.getTime(),
      moistureNum: r.soil_moisture_level ? moistureLevelMap[r.soil_moisture_level] : null,
      moistureLabel: r.soil_moisture_level ? t(r.soil_moisture_level) : t('Unknown'),
      runtime: r.pump_runtime_hours || 0,
      isDemo: r.is_demo
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded text-sm">
          <p className="font-semibold text-gray-700">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.dataKey === 'moistureNum' ? entry.payload.moistureLabel : entry.value}
            </p>
          ))}
          {payload[0].payload.isDemo && (
            <p className="text-yellow-600 font-medium text-xs mt-1">{t('Demo Data')}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-primary-100 rounded w-1/4"></div>
            <div className="h-32 bg-primary-50 rounded"></div>
            <div className="h-64 bg-primary-50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Farm Analytics')}</h1>
          <p className="text-gray-500 mt-1">{t('Historical trends and recovery insights based on recorded data.')}</p>
        </div>
        
        {/* Date Filters */}
        <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1">
          <button 
            onClick={() => setTimeFilter(7)}
            className={`px-3 py-1.5 text-sm rounded ${timeFilter === 7 ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {t('Last 7 Days')}
          </button>
          <button 
            onClick={() => setTimeFilter(30)}
            className={`px-3 py-1.5 text-sm rounded ${timeFilter === 30 ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {t('Last 30 Days')}
          </button>
          <button 
            onClick={() => setTimeFilter(null)}
            className={`px-3 py-1.5 text-sm rounded ${timeFilter === null ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {t('All Time')}
          </button>
        </div>
      </div>

      {error ? (
        <Card className="p-6 text-red-600 text-center">{error}</Card>
      ) : readings.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <Activity className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t('No data available')}</h3>
          <p className="text-gray-500 mt-2 max-w-md">{t('There are no recorded observations for the selected period. Add manual readings in the Monitoring section to see analytics.')}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 flex flex-col space-y-2 border-l-4 border-blue-500">
              <span className="text-sm font-medium text-gray-500">{t('Total Observations')}</span>
              <span className="text-2xl font-bold text-gray-900">{totalObservations}</span>
              <span className="text-xs text-gray-400">{t('Based on authenticated records')}</span>
            </Card>
            
            <Card className="p-5 flex flex-col space-y-2 border-l-4 border-green-500">
              <span className="text-sm font-medium text-gray-500">{t('Latest Reading')}</span>
              <span className="text-md font-semibold text-gray-900 truncate">
                {latestReading ? new Date(latestReading.created_at!).toLocaleString() : '-'}
              </span>
              <span className="text-xs text-gray-400">
                {latestReading?.is_demo ? <Badge variant="warning">{t('Demo Data')}</Badge> : t('Real Data')}
              </span>
            </Card>

            <Card className="p-5 flex flex-col space-y-2 border-l-4 border-purple-500">
              <span className="text-sm font-medium text-gray-500">{t('Total Pump Runtime')}</span>
              <span className="text-2xl font-bold text-gray-900">{totalRuntime.toFixed(1)} {t('hrs')}</span>
              <span className="text-xs text-gray-400">{t('Over selected period')}</span>
            </Card>

            <Card className="p-5 flex flex-col space-y-2 border-l-4 border-yellow-500">
              <span className="text-sm font-medium text-gray-500">{t('Borewell Insight')}</span>
              <span className="text-sm font-medium text-gray-800 line-clamp-2">{getRecoveryInsight()}</span>
            </Card>
          </div>

          {/* Explainable Insights */}
          <Card className="p-6 bg-primary-50/50 border-primary-100">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-primary-600 mt-1" />
              <div>
                <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider">{t('Analytics Insights')}</h3>
                <ul className="mt-3 space-y-2 text-sm text-primary-800">
                  <li>• {getMoistureTrend()}</li>
                  <li>• {getRecoveryInsight()}</li>
                  <li>• {totalObservations < 5 ? t('Sample size is currently small, trends may not be highly reliable.') : t('Based on sufficient manual observations.')}</li>
                </ul>
                <div className="mt-4 flex items-center text-xs text-primary-600 bg-primary-100/50 p-2 rounded">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t('Insights are derived directly from manual recordings and do not represent precise future predictions.')}
                </div>
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Moisture Chart */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Droplet className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-gray-900">{t('Soil Moisture Trend')}</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis 
                      domain={[0, 4]} 
                      ticks={[1, 2, 3]} 
                      tickFormatter={(val) => {
                        if (val === 1) return t('LOW');
                        if (val === 2) return t('MEDIUM');
                        if (val === 3) return t('HIGH');
                        return '';
                      }}
                      tick={{ fontSize: 12, fill: '#6B7280' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="moistureNum" name={t('Moisture')} stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Runtime Chart */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">{t('Pump Runtime (Hours)')}</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="runtime" name={t('Runtime')} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
