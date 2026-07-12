import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../api/services/driverService';
import type { DriverUpdate } from '../types';

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: driverService.list,
  });
};

export const useDriver = (id: number) => {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => driverService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driverService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DriverUpdate }) =>
      driverService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['drivers', variables.id] });
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driverService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};
