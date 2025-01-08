import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import axios from "axios";

export interface CartItem {
  accountId: number;
  serviceId: number;
  martyrId: number;
}

// Add new interface for the API response
export interface CartItemResponse {
  cartId: number;
  accountId: number;
  serviceId: number;
  martyrId: number;
  status: boolean;
}

// Add new interfaces for the expanded response
export interface ServiceView {
  serviceId: number;
  categoryId: number;
  categoryName: string;
  serviceName: string;
  description: string;
  price: number;
  imagePath: string;
  status: boolean;
}

export interface CartItemDetailResponse {
  cartId: number;
  accountId: number;
  serviceId: number;
  martyrCode: string;
  martyrName: string;
  martyrId: number;
  status: boolean;
  serviceView: ServiceView;
}

export const addToCart = async (items: CartItem[]): Promise<boolean> => {
  try {
    await api.post('/api/CartItems', items);
    return true;
  } catch (error) {
    console.error('Error adding items to cart:', error);
    throw new Error('Failed to add items to cart');
  }
};

// Add function to get cart items
export const getCartItems = async (customerId: number): Promise<CartItemDetailResponse[]> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await api.get(`/api/CartItems/cart/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) { 
    if (axios.isAxiosError(error)) {
      console.error('Fetch Cart Items Error:', error.response?.data);
    }
    throw error;
  }
};


