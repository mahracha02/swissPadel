import { get, post, put, del } from './api';

export interface Object {
  id: number;
  type: string;
}

export const objectsService = {
  getAll: () => get('/objects'),
  create: (data: Omit<Object, 'id'>) => post('/objects', data),
  update: (id: number, data: Partial<Object>) => put(`/objects/${id}`, data),
  delete: (id: number) => del(`/objects/${id}`),
}; 