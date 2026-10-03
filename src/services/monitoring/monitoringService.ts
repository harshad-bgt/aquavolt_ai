import { apiClient } from '../api/apiClient';

export interface FarmReading {
  id?: number;
  user_id?: number;
  soil_moisture_level?: string | null;
  soil_temperature?: number | null;
  borewell_water_level?: string | null;
  pump_status?: string | null;
  pump_runtime_hours?: number | null;
  solar_availability?: string | null;
  weather_forecast?: string | null;
  rainfall_mm?: number | null;
  is_demo?: boolean;
  created_at?: string;
}

export const monitoringService = {
  createReading: async (data: FarmReading): Promise<FarmReading> => {
    const response = await apiClient.post('/monitoring/', data);
    return response;
  },

  getLatestReading: async (): Promise<FarmReading> => {
    const response = await apiClient.get('/monitoring/latest');
    return response;
  },

  getHistory: async (limit: number = 100, days?: number): Promise<FarmReading[]> => {
    let url = `/monitoring/history?limit=${limit}`;
    if (days !== undefined) {
      url += `&days=${days}`;
    }
    const response = await apiClient.get(url);
    return response;
  }
};
