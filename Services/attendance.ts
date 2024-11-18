import axios from 'axios';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AttendanceCheckRequest {
  attendanceId: number;
  imagePath1?: string;
  imagePath2?: string;
  imagePath3?: string;
}

export const checkAttendanceForStaff = async (
  staffId: number,
  attendanceId: number,
  imagePath1?: string,
  imagePath2?: string,
  imagePath3?: string
) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const requestBody: AttendanceCheckRequest = {
      attendanceId,
      imagePath1: imagePath1 || "",
      imagePath2: imagePath2 || "",
      imagePath3: imagePath3 || ""
    };
    console.log('API Request Details:', {
        url: '/api/Attendance/CheckAttendanceForStaff',
        method: 'PUT',
        params: { staffId },
        requestBody,
        token: `Bearer ${token.substring(0, 20)}...`,  // Only show part of token for security
      });
    const response = await api.put(
      '/Attendance/CheckAttendanceForStaff',
      requestBody,
      {
        params: { staffId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      }
      if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền thực hiện thao tác này');
      }
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi check-in');
    }
    throw error;
  }
};
