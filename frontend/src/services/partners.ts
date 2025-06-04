import { get, post, put, del, patch } from './api';

export interface Partner {
  id: number;
  name: string;
  image: string;
  siteUrl: string;
  published: boolean;
}

export const partnersService = {
  getAll: () => get('/partners'),
  create: (data: Omit<Partner, 'id'>) => post('/partners', data),
  update: (id: number, data: Partial<Partner>) => put(`/partners/${id}`, data),
  delete: (id: number) => del(`/partners/${id}`),
  togglePublish: (id: number) => patch(`/partners/${id}/toggle-publish`, {}),
}; 