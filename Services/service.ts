import { api } from "./api";
import axios from "axios";

export interface Service {
  serviceId: number;
  categoryId: number;
  categoryName: string;
  serviceName: string;
  description: string;
  price: number;
  imagePath: string;
  status: boolean;
}

// Add new interfaces for the material type
interface Material {
  materialId: number;
  materialName: string;
  imagePath: string | null;
  description: string;
  price: number;
  status: boolean;
}

// Extend the Service interface to include the new fields
interface ServiceDetail extends Service {
  isScheduleService: boolean;
  recurringType: number;
  materials: Material[];
}

export const getTrendingServices = async (topN: number = 5): Promise<Service[]> => {
  try {
    const response = await api.get(`/api/Service/trending-services?topN=${topN}`);
    // Log the response to see its structure
  
    
  
    
    // If the data is directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If the data is nested (e.g., response.data.data)
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching trending services:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getServicesByCategory = async (): Promise<Service[]> => {
  try {
    const response = await api.get(`/api/Service/services`);
    
    // If the data is directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If the data is nested (e.g., response.data.data)
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching services by category:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getServiceDetail = async (serviceId: number) => {
  try {
    // Add validation
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    
    const response = await api.get(`/api/Service/service-detail?serviceId=${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service detail:', error);
    throw error;
  }
};