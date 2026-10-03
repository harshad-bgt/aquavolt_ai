import { apiClient } from '../api/apiClient';

export const farmService = {
  getProfile: async () => {
    return apiClient.get('/farm/profile');
  },
  createProfile: async (profileData: any) => {
    return apiClient.post('/farm/profile', profileData);
  },
  updateProfile: async (profileData: any) => {
    return apiClient.put('/farm/profile', profileData);
  }
};
