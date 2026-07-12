import client from '../client';
import type { Vehicle, VehicleCreate, VehicleUpdate, DeleteResponse } from '../../types';

export const vehicleService = {
  list: async (): Promise<Vehicle[]> => {
    const response = await client.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  create: async (data: VehicleCreate): Promise<Vehicle> => {
    const response = await client.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await client.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  update: async (id: number, data: VehicleUpdate): Promise<Vehicle> => {
    const response = await client.patch<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<DeleteResponse> => {
    const response = await client.delete<DeleteResponse>(`/vehicles/${id}`);
    return response.data;
  },
};
