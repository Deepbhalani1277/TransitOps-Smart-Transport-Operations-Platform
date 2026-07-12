import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../api/services/maintenanceService';
import type { MaintenanceLogUpdate } from '../types';

export const useMaintenanceLogs = () => {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceService.list,
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: maintenanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      // Invalidate vehicles since a vehicle might now be 'In Shop'
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MaintenanceLogUpdate }) =>
      maintenanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      // Invalidate vehicles since a vehicle might now be 'Available'
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
