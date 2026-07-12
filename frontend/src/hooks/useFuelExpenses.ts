import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelService } from '../api/services/fuelService';

export const useFuelLogs = () => {
  return useQuery({
    queryKey: ['fuel'],
    queryFn: fuelService.listFuel,
  });
};

export const useCreateFuelLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fuelService.createFuel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel'] });
      // Invalidate cost reports
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: fuelService.listExpenses,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fuelService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      // Invalidate cost reports
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
