import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

interface CreateOrderRequest {
  orderBody: {
    expectedCompletionDate: string;
    note: string;
  }
}

interface CreateOrderResponse {
  // Add response type based on your API's response structure
  id: number;
  // Add other response fields as needed
}

export const orderService = {
  createOrder: async (
    customerId: number,
    paymentMethod: string,
    request: CreateOrderRequest | { expectedCompletionDate: string; note: string }
  ): Promise<CreateOrderResponse> => {
    try {
      const orderData = 'orderBody' in request ? request.orderBody : request;
      
      //Convert DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = orderData.expectedCompletionDate.split('/');
      const formattedDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const date = new Date(formattedDateString);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${orderData.expectedCompletionDate}`);
      }

      const formattedRequest = {
        
          expectedCompletionDate: date.toISOString(),
          note: orderData.note
        
      };

      console.log('Formatted request:', formattedRequest);

      console.log('Creating order with:', {
        customerId,
        paymentMethod,
        formattedRequest,
      });
      const token = await AsyncStorage.getItem('accessToken');
      
      // Add token validation
      if (!token) {
        throw new Error('No access token found');
      }
      
      // Add debug logging
      console.log('Token being used:', token);

      const response = await api.post('/api/Orders', formattedRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          customerId,
          paymentMethod,
        },
      });

      // Add more detailed error logging
      if (!response) {
        throw new Error('No response received from server');
      }

      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      // Improve error logging
      console.error('Order creation failed:', {
        status: error.response?.status,
        message: error.response?.data,
        error: error
      });
      throw error;
    }
  },
};

