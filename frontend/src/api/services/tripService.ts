import client from '../client';
import type { Trip, TripCreate, TripUpdate, TripCompleteRequest } from '../../types';

export const tripService = {
  list: async (): Promise<Trip[]> => {
    const response = await client.get<Trip[]>('/trips');
    return response.data;
  },

  create: async (data: TripCreate): Promise<Trip> => {
    const response = await client.post<Trip>('/trips', data);
    return response.data;
  },

  getById: async (id: number): Promise<Trip> => {
    const response = await client.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  update: async (id: number, data: TripUpdate): Promise<Trip> => {
    const response = await client.patch<Trip>(`/trips/${id}`, data);
    return response.data;
  },

  dispatch: async (id: number): Promise<Trip> => {
    const response = await client.post<Trip>(`/trips/${id}/dispatch`);
    return response.data;
  },

  complete: async (id: number, data: TripCompleteRequest): Promise<Trip> => {
    const response = await client.post<Trip>(`/trips/${id}/complete`, data);
    return response.data;
  },
};
