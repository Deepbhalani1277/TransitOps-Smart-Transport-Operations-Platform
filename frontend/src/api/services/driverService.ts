import client from '../client';
import type { Driver, DriverCreate, DriverUpdate, DeleteResponse } from '../../types';

export const driverService = {
  list: async (): Promise<Driver[]> => {
    const response = await client.get<Driver[]>('/drivers');
    return response.data;
  },

  create: async (data: DriverCreate): Promise<Driver> => {
    const response = await client.post<Driver>('/drivers', data);
    return response.data;
  },

  getById: async (id: number): Promise<Driver> => {
    const response = await client.get<Driver>(`/drivers/${id}`);
    return response.data;
  },

  update: async (id: number, data: DriverUpdate): Promise<Driver> => {
    const response = await client.patch<Driver>(`/drivers/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<DeleteResponse> => {
    const response = await client.delete<DeleteResponse>(`/drivers/${id}`);
    return response.data;
  },
};
