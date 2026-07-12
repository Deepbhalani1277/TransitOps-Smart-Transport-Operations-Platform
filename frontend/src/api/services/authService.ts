import client from '../client';
import type { User, Token, LoginRequest, RegisterRequest } from '../../types';

const isSandbox = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token === 'sandbox-token';
};

export const authService = {
  login: async (data: LoginRequest): Promise<Token> => {
    try {
      const response = await client.post<Token>('/auth/login', data);
      return response.data;
    } catch (err: any) {
      // If it is a network error (backend offline), check sandbox credentials
      if (!err.response) {
        if (data.email === 'john@example.com' && data.password === 'securepassword') {
          return {
            access_token: 'sandbox-token',
            token_type: 'bearer',
          };
        }
      }
      throw err;
    }
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await client.post<User>('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    if (isSandbox()) {
      const selectedRole = (localStorage.getItem('sandbox_role') as any) || 'Fleet Manager';
      return {
        id: 1,
        name: `Jane Doe (${selectedRole})`,
        email: 'john@example.com',
        role: selectedRole,
      };
    }
    const response = await client.get<User>('/auth/me');
    return response.data;
  },
};
export { isSandbox };
