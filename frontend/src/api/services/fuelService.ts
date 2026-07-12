import client from '../client';
import type { FuelLog, FuelLogCreate, Expense, ExpenseCreate } from '../../types';
import { isSandbox } from './authService';
import { mockDb } from '../mockDb';

export const fuelService = {
  listFuel: async (): Promise<FuelLog[]> => {
    if (isSandbox()) return mockDb.getFuel();
    const response = await client.get<FuelLog[]>('/fuel');
    return response.data;
  },

  createFuel: async (data: FuelLogCreate): Promise<FuelLog> => {
    if (isSandbox()) return mockDb.createFuel(data);
    const response = await client.post<FuelLog>('/fuel', data);
    return response.data;
  },

  listExpenses: async (): Promise<Expense[]> => {
    if (isSandbox()) return mockDb.getExpenses();
    const response = await client.get<Expense[]>('/expenses');
    return response.data;
  },

  createExpense: async (data: ExpenseCreate): Promise<Expense> => {
    if (isSandbox()) return mockDb.createExpense(data);
    const response = await client.post<Expense>('/expenses', data);
    return response.data;
  },
};
