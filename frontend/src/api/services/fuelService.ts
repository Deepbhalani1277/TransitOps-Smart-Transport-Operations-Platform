import client from '../client';
import type { FuelLog, FuelLogCreate, Expense, ExpenseCreate } from '../../types';

export const fuelService = {
  listFuel: async (): Promise<FuelLog[]> => {
    const response = await client.get<FuelLog[]>('/fuel');
    return response.data;
  },

  createFuel: async (data: FuelLogCreate): Promise<FuelLog> => {
    const response = await client.post<FuelLog>('/fuel', data);
    return response.data;
  },

  listExpenses: async (): Promise<Expense[]> => {
    const response = await client.get<Expense[]>('/expenses');
    return response.data;
  },

  createExpense: async (data: ExpenseCreate): Promise<Expense> => {
    const response = await client.post<Expense>('/expenses', data);
    return response.data;
  },
};
