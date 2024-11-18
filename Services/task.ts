import axios from 'axios';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

interface Task {
  // Add your task properties here
  taskId: number;
  // ... other task properties
}

interface CreateTaskRequest {
  accountId: number;
  orderId: number;
  detailId: number;
}

interface UploadTaskImagesRequest {
  urlImages: string[];
}

export const getTasksByAccount = async (
  accountId: number,
  date?: string,
  pageIndex: number = 1,
  pageSize: number = 5
): Promise<PaginatedResponse<Task>> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/Task/tasks/account/' + accountId, {
      params: {
        pageIndex,
        pageSize,
      },
      
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Task API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Task API Error:', error.response?.data);
    }
    throw error;
  }
};

export const createTask = async (taskData: CreateTaskRequest): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    // Debug logs
    console.log('=== Debug Create Task ===');
    console.log('1. Task Data:', JSON.stringify(taskData, null, 2));
    console.log('2. Token:', token);
    
    // Make sure we're using the correct endpoint
    const response = await api.post('/Task/tasks', [taskData], {  // Note: Wrapping taskData in an array
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('4. API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Create Task Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
    }
    throw error;
  }
};

export const uploadTaskImages = async (taskId: number, imageUrls: string[]): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    // Debug logs
    console.log('=== Debug Upload Task Images ===');
    console.log('1. Task ID:', taskId);
    console.log('2. Image URLs:', imageUrls);

    const requestBody: UploadTaskImagesRequest = {
      urlImages: imageUrls
    };

    const response = await api.put(`/Task/tasks/${taskId}/images`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('3. API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Upload Task Images Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
    }
    throw error;
  }
};
