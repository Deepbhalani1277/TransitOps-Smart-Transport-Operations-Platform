import client from '../client';
import type { Trip, TripCreate, TripUpdate, TripCompleteRequest } from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const tripService = {
  list: async (): Promise<Trip[]> => {
    if (isSandbox()) return mockDb.getTrips();
    const response = await client.get<Trip[]>('/trips');
    return response.data;
  },

  create: async (data: TripCreate): Promise<Trip> => {
    if (isSandbox()) return mockDb.createTrip(data);
    const response = await client.post<Trip>('/trips', data);
    return response.data;
  },

  getById: async (id: number): Promise<Trip> => {
    if (isSandbox()) {
      const t = mockDb.getTrips().find((item) => item.id === id);
      if (!t) throw new Error('Trip not found.');
      return t;
    }
    const response = await client.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  update: async (id: number, data: TripUpdate): Promise<Trip> => {
    if (isSandbox()) return mockDb.updateTrip(id, data);
    const response = await client.patch<Trip>(`/trips/${id}`, data);
    return response.data;
  },

  dispatch: async (id: number): Promise<Trip> => {
    if (isSandbox()) return mockDb.dispatchTrip(id);
    const response = await client.post<Trip>(`/trips/${id}/dispatch`);
    return response.data;
  },

  complete: async (id: number, data: TripCompleteRequest): Promise<Trip> => {
    if (isSandbox()) return mockDb.completeTrip(id, data);
    const response = await client.post<Trip>(`/trips/${id}/complete`, data);
    return response.data;
  },
};
