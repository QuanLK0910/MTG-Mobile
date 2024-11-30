import axios from 'axios';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the response type for better type safety
interface ProfileResponse {
  // Add your profile response properties here
  // This should match the actual API response structure
}

interface UpdateProfileRequest {
  fullName: string;
  dateOfBirth: string;
  address: string;
  avatarPath: string;
  emailAddress: string;
  areaId: number;
}

export const getProfile = async (accountId: number): Promise<ProfileResponse> => {
    
  const endpoint = `/Account/getProfile/${accountId}`;  
  console.log('Full API URL:', api.defaults.baseURL + endpoint);
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await api.get<ProfileResponse>(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
    throw error;
  }
};

export const updateProfile = async (accountId: number, profileData: UpdateProfileRequest): Promise<void> => {
  const endpoint = `/Account/update-profile-staff-or-manager/${accountId}`;
  
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    await api.put(endpoint, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
    throw error;
  }
};
