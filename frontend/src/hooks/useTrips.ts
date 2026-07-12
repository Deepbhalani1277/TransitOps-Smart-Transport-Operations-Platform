import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '../api/services/tripService';
import type { TripUpdate, TripCompleteRequest } from '../types';

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripService.list,
  });
};

export const useTrip = (id: number) => {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      // Invalidate vehicles and drivers list since status may change (e.g. if we dispatch or create)
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TripUpdate }) =>
      tripService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
    },
  });
};

export const useDispatchTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.dispatch,
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TripCompleteRequest }) =>
      tripService.complete(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['fuel'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};
