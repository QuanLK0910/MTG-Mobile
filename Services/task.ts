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

    const response = await api.get('/Task/tasksNotScheduling/account/' + accountId, {
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

export const uploadImageToFirebase = async (uri: string, taskId: number): Promise<string> => {
  try {
    // Create a unique file path in Firebase Storage
    const filename = `tasks/${taskId}/${Date.now()}.jpg`;
    const reference = storage().ref(filename);

    // Upload the file
    await reference.putFile(uri);

    // Get the download URL
    const downloadURL = await reference.getDownloadURL();
    console.log('Image uploaded to Firebase:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Firebase Upload Error:', error);
    throw error;
  }
};

export const uploadTaskImages = async (taskId: number, imageUris: string[]): Promise<any> => {
  try {
    // First upload all images to Firebase
    const uploadPromises = imageUris.map(uri => uploadImageToFirebase(uri, taskId));
    const firebaseUrls = await Promise.all(uploadPromises);

    // Then send the Firebase URLs to your API
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }

    const requestBody: UploadTaskImagesRequest = {
      urlImages: firebaseUrls
    };

    const response = await api.put(`/Task/tasks/${taskId}/images`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Upload Task Images Error:', error.response?.data);
    }
    throw error;
  }
};
