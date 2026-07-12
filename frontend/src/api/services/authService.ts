import client from '../client';
import type { User, Token, LoginRequest, RegisterRequest } from '../../types';

export const authService = {
  login: async (data: LoginRequest): Promise<Token> => {
    const response = await client.post<Token>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await client.post<User>('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await client.get<User>('/auth/me');
    return response.data;
  },
};
