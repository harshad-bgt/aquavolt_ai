import { apiClient } from '../api/apiClient';

export const authService = {
  login: async (credentials: any) => {
    // API uses username/password format for OAuth2PasswordBearer, but we customized it to take JSON
    return apiClient.post('/auth/login', credentials);
  },
  signup: async (userData: any) => {
    return apiClient.post('/auth/signup', userData);
  },
  getMe: async () => {
    return apiClient.get('/auth/me');
  },
  logout: async () => {
    return apiClient.post('/auth/logout', {});
  }
};
