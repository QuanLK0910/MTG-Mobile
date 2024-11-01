import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

// Add these constants at the top of the file
const AUTH_ENDPOINTS = {
  LOGIN: '/Auth/auth',
  LOGOUT: '/Auth/logout'
} as const;

export const authService = {
  async login({ phoneNumber, password }: { phoneNumber: string; password: string }) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { phoneNumber, password });
      
      // Create an array of storage items, only adding valid values
      const storageItems: [string, string][] = [];
      
      if (response.data.accessToken) {
        storageItems.push(['accessToken', response.data.accessToken]);
      }
      
      if (response.data.user && typeof response.data.user === 'object') {
        storageItems.push(['user', JSON.stringify(response.data.user)]);
      }
      
      // Only call multiSet if we have items to store
      if (storageItems.length > 0) {
        await AsyncStorage.multiSet(storageItems);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.message === 'Network Error') {
        
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      // If it's an axios error with a response
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      // For any other errors
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getToken() {
    return await AsyncStorage.getItem('accessToken');
  },

  async setToken(accessToken: string) {
    await AsyncStorage.setItem('accessToken', accessToken);
  }
};
