import client from '../client';
import type { MaintenanceLog, MaintenanceLogCreate, MaintenanceLogUpdate } from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const maintenanceService = {
  list: async (): Promise<MaintenanceLog[]> => {
    if (isSandbox()) return mockDb.getMaintenance();
    const response = await client.get<MaintenanceLog[]>('/maintenance');
    return response.data;
  },

  create: async (data: MaintenanceLogCreate): Promise<MaintenanceLog> => {
    if (isSandbox()) return mockDb.createMaintenance(data);
    const response = await client.post<MaintenanceLog>('/maintenance', data);
    return response.data;
  },

  update: async (id: number, data: MaintenanceLogUpdate): Promise<MaintenanceLog> => {
    if (isSandbox()) return mockDb.updateMaintenance(id, data);
    const response = await client.patch<MaintenanceLog>(`/maintenance/${id}`, data);
    return response.data;
  },
};
