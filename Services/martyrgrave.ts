import { api } from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';
interface SearchMartyrGraveParams {
  name?: string;
  yearOfBirth?: string;
  yearOfSacrifice?: string;
  homeTown?: string;
  page?: number;
  pageSize?: number;
}

interface MartyrGraveImage {
  image: string;
}

interface MartyrGrave {
  martyrId: number;
  name: string;
  nickName: string;
  homeTown: string;
  dateOfBirth: string;
  dateOfSacrifice: string;
  martyrCode: string;
  graveLocation: string | null;
  images: MartyrGraveImage[];
}

interface SearchMartyrGraveResponse {
  items: MartyrGrave[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

interface MartyrGraveDetail extends MartyrGrave {
  areaId: number;
  areaName: string | null;
  areaNumber: number;
  martyrNumber: number;
  rowNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  martyrGraveInformations: {
    informationId: number;
    martyrId: number;
    name: string;
    render: boolean;
    nickName: string;
    position: string;
    medal: string;
    homeTown: string;
    dateOfBirth: string;
    dateOfSacrifice: string;
  }[];
}

export const searchMartyrGraves = async (params: SearchMartyrGraveParams) => {
  try {
    const response = await api.get<SearchMartyrGraveResponse>('/api/MartyrGrave/search', {
      params: {
        name: params.name || undefined,
        yearOfBirth: params.yearOfBirth || undefined,
        yearOfSacrifice: params.yearOfSacrifice || undefined,
        homeTown: params.homeTown || undefined,
        page: params.page || 1,
        pageSize: params.pageSize || 15,
      },
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });
    
    if (response.status === 404) {
      return { data: [] };
    }
    
    return response;
  } catch (error) {
    return { data: [] };
  }
};

export const getMartyrGraveById = async (id: number) => {
  try {
    const response = await api.get<MartyrGraveDetail>(`/api/MartyrGrave/${id}`, {
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });

    if (response.status === 404) {
      return null;
    }

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getMartyrGraveByCustomerId = async (customerId: number) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await api.get<MartyrGraveDetail>(
      `/api/MartyrGrave/getMartyrGraveByCustomerId/${customerId}`,
      {
        validateStatus: (status) => {
          return status === 200 || status === 404;
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 404) {
      return null;
    }

    return response.data;
  } catch (error) {
    return null;
    }
};