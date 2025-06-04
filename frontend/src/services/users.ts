import { get, post, put, del, patch } from './api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
}

export const usersService = {
  getAll: () => get('/users'),
  create: (data: Omit<User, 'id'> & { password: string }) => post('/users', data),
  update: (id: number, data: Partial<User>) => put(`/users/${id}`, data),
  delete: (id: number) => del(`/users/${id}`),
  changePassword: (id: number, password: string) => patch(`/users/${id}/change-password`, { password }),
}; 