import axios from 'axios';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update interface to match actual API response
interface ScheduleDetail {
  scheduleDetailId: number;
  slotId: number;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  description: string;
  taskId: number;
}

interface ScheduleDetailRequest {
  taskId: number;
  slotId: number;
  date: string;
  description: string;
}

interface CreateScheduleDetailForStaffRequest {
  requests: ScheduleDetailRequest[];
}

export const getScheduleDetailForStaff = async (
  accountId: number,
  slotId: number,
  date: string
): Promise<ScheduleDetail[]> => {
  try {
    // Get and verify token
    const token = await AsyncStorage.getItem('accessToken');
    console.log('Token from storage:', token); // Debug log
    
    if (!token) {
      console.log('No token found in storage');
      return [];
    }

    const response = await api.get(
      '/ScheduleDetail/GetScheduleDetailForStaff',
      {
        params: {
          accountId,
          slotId,
          Date: date
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log successful response
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (Array.isArray(response?.data)) {
      return response.data;
    }
    return [];

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Auth Error Details:', {
        token: await AsyncStorage.getItem('userToken'),
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    return [];
  }
};

export const getSchedulesForStaffFilterDate = async (
  accountId: number,
  fromDate: string,
  toDate: string
): Promise<ScheduleDetail[]> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No token found in storage');
      return [];
    }

    const response = await api.get(
      '/ScheduleDetail/GetSchedulesForStaffFiltterDate',
      {
        params: {
          accountId,
          FromDate: fromDate,
          ToDate: toDate
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (Array.isArray(response?.data)) {
      return response.data;
    }
    return [];

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Auth Error Details:', {
        token: await AsyncStorage.getItem('userToken'),
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    return [];
  }
};

export const createScheduleDetailForStaff = async (
  accountId: number,
  scheduleDetail: ScheduleDetailRequest
): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No token found in storage');
      return false;
    }

    // Create the request body directly
    const requests = [scheduleDetail];

    console.log('Creating schedule detail with:', JSON.stringify({
      url: '/ScheduleDetail/CreateScheduleDetailForStaff',
      accountId,
      requests,
      token: token.substring(0, 20) + '...'
    }, null, 2));

    const response = await api.post(
      '/ScheduleDetail/CreateScheduleDetailForStaff',
      requests,  // Send the array directly
      {
        params: { accountId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));
    return true;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Failed request data:', JSON.stringify({
        accountId,
        scheduleDetail
      }, null, 2));
    }
    throw error;
  }
};

export const deleteScheduleDetail = async (
  scheduleDetailId: number,
  accountId: number
): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No token found in storage');
      return false;
    }

    console.log('Deleting schedule detail:', JSON.stringify({
      url: `/ScheduleDetail/DeleteScheduleDetail/${scheduleDetailId}`,
      scheduleDetailId,
      accountId,
      token: token.substring(0, 20) + '...'
    }, null, 2));

    const response = await api.delete(
      `/ScheduleDetail/DeleteScheduleDetail/${scheduleDetailId}`,
      {
        params: { accountId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));
    return true;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Failed request data:', JSON.stringify({
        scheduleDetailId,
        accountId
      }, null, 2));
    }
    throw error;
  }
};

export const getScheduleDetailById = async (
  accountId: number,
  scheduleDetailId: number
): Promise<ScheduleDetail | null> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No token found in storage');
      return null;
    }

    const response = await api.get(
      '/ScheduleDetail/GetByScheduleDetailId',
      {
        params: {
          accountId,
          scheduleDetailId
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    // The data is directly in response.data, no need to access .scheduleDetail
    if (response?.data) {
      return response.data;
    }
    
    return null;

  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

