import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../api/services/vehicleService';
import type { VehicleUpdate } from '../types';

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehicleService.list,
  });
};

export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleUpdate }) =>
      vehicleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehicleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
