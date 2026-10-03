import { apiClient } from '../api/apiClient';

export type RecommendationCategory =
  | 'WAIT_BEFORE_IRRIGATING'
  | 'IRRIGATION_MAY_BE_NEEDED'
  | 'BOREWELL_RECOVERY'
  | 'RAIN_DELAY'
  | 'SOLAR_WINDOW'
  | 'INSUFFICIENT_DATA';

export interface CurrentConditions {
  soil_moisture_level?: string | null;
  weather_forecast?: string | null;
  borewell_water_level?: string | null;
  solar_availability?: string | null;
}

export interface AdviceResponse {
  primary_recommendation: RecommendationCategory;
  reasons: string[];
  contributing_conditions: string[];
  missing_inputs: string[];
  suggested_action: string;
  confidence: string;
  timestamp: string;
}

export const adviceService = {
  evaluate: async (conditions: CurrentConditions): Promise<AdviceResponse> => {
    const response = await apiClient.post('/advice/evaluate', conditions);
    return response as AdviceResponse;
  },
};
