import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:5244/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data?.accessToken === undefined) {
      delete response.data.accessToken;
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      throw new Error(
        'Unable to connect to the server. Please check your internet connection and ensure the server is running.'
      );
    }

    if (error.response.status === 401) {
      // Safely remove items one by one
      try {
        await AsyncStorage.removeItem('accessToken');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
      throw new Error('Session expired. Please login again.');
    }

    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
);
