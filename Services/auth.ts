import api from './api';

interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    phone: string;
    name: string;
    // Add other user properties
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/Auth/auth', {
      phoneNumber: credentials.phoneNumber,
      password: credentials.password
    });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  // Add other auth-related API calls
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
