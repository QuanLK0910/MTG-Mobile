import { api } from "./api";

// Define interfaces forthe API
interface GraveServiceParams {
  martyrId?: number;
  categoryId?: number;
}

interface GraveService {
  graveServiceId: number;
  serviceId: number;
  martyrId: number;
  categoryId: number;
  categoryName: string;
  serviceName: string;
  description: string;
  price: number;
  imagePath: string;
  status: boolean;
  isScheduleService: boolean;
  recurringType: number;
}

export const getGraveServices = async (params?: GraveServiceParams): Promise<GraveService[]> => {
  const response = await api.get<GraveService[]>('/api/GraveService/grave-services', { params });
  return response.data;
};

