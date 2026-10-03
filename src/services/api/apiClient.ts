const BASE_URL = '/api';

export const apiClient = {
  get: async (endpoint: string) => {
    return request(endpoint, { method: 'GET' });
  },
  post: async (endpoint: string, body: any) => {
    return request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },
  put: async (endpoint: string, body: any) => {
    return request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete: async (endpoint: string) => {
    return request(endpoint, { method: 'DELETE' });
  }
};

async function request(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem('aquavolt_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred during the request.');
  }

  return response.json();
}
