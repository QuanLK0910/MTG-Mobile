import { api } from "./api";

interface ServiceCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  urlImageCategory: string;
  status: boolean;
}

export const serviceCategories = {
  getCategories: () => {
    return api.get<ServiceCategory[]>('/api/ServiceCategory/categories');
  }
};

