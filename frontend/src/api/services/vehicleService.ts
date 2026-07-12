import client from '../client';
import type { Vehicle, VehicleCreate, VehicleUpdate, DeleteResponse } from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const vehicleService = {
  list: async (): Promise<Vehicle[]> => {
    if (isSandbox()) return mockDb.getVehicles();
    const response = await client.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  create: async (data: VehicleCreate): Promise<Vehicle> => {
    if (isSandbox()) return mockDb.createVehicle(data);
    const response = await client.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    if (isSandbox()) {
      const v = mockDb.getVehicles().find((item) => item.id === id);
      if (!v) throw new Error('Vehicle not found.');
      return v;
    }
    const response = await client.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  update: async (id: number, data: VehicleUpdate): Promise<Vehicle> => {
    if (isSandbox()) return mockDb.updateVehicle(id, data);
    const response = await client.patch<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<DeleteResponse> => {
    if (isSandbox()) return mockDb.deleteVehicle(id);
    const response = await client.delete<DeleteResponse>(`/vehicles/${id}`);
    return response.data;
  },
};
