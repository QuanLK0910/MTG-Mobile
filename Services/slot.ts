import { api } from './api';

export interface Slot {
  slotId: number;
  slotName: string;
  description: string;
  startTime: string;
  endTime: string;
}

export const slotService = {
  getAll: async (): Promise<Slot[]> => {
    const response = await api.get<Slot[]>('/Slot/GetAll');
    return response.data;
  }
};
