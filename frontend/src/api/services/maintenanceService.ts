import client from '../client';
import type { MaintenanceLog, MaintenanceLogCreate, MaintenanceLogUpdate } from '../../types';

export const maintenanceService = {
  list: async (): Promise<MaintenanceLog[]> => {
    const response = await client.get<MaintenanceLog[]>('/maintenance');
    return response.data;
  },

  create: async (data: MaintenanceLogCreate): Promise<MaintenanceLog> => {
    const response = await client.post<MaintenanceLog>('/maintenance', data);
    return response.data;
  },

  update: async (id: number, data: MaintenanceLogUpdate): Promise<MaintenanceLog> => {
    const response = await client.patch<MaintenanceLog>(`/maintenance/${id}`, data);
    return response.data;
  },
};
