import client from '../client';
import type { Driver, DriverCreate, DriverUpdate, DeleteResponse } from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const driverService = {
  list: async (): Promise<Driver[]> => {
    if (isSandbox()) return mockDb.getDrivers();
    const response = await client.get<Driver[]>('/drivers');
    return response.data;
  },

  create: async (data: DriverCreate): Promise<Driver> => {
    if (isSandbox()) return mockDb.createDriver(data);
    const response = await client.post<Driver>('/drivers', data);
    return response.data;
  },

  getById: async (id: number): Promise<Driver> => {
    if (isSandbox()) {
      const d = mockDb.getDrivers().find((item) => item.id === id);
      if (!d) throw new Error('Driver not found.');
      return d;
    }
    const response = await client.get<Driver>(`/drivers/${id}`);
    return response.data;
  },

  update: async (id: number, data: DriverUpdate): Promise<Driver> => {
    if (isSandbox()) return mockDb.updateDriver(id, data);
    const response = await client.patch<Driver>(`/drivers/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<DeleteResponse> => {
    if (isSandbox()) return mockDb.deleteDriver(id);
    const response = await client.delete<DeleteResponse>(`/drivers/${id}`);
    return response.data;
  },
};
