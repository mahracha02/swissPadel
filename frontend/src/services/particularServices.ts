import { get, post, put, del, patch } from './api';

export interface ParticularService {
  id: number;
  title: string;
  description?: string;
  image?: string;
  published: boolean;
}

export const particularServicesService = {
  getAll: () => get('/particular-services'),
  create: (data: Omit<ParticularService, 'id'>) => post('/particular-services', data),
  update: (id: number, data: Partial<ParticularService>) => put(`/particular-services/${id}`, data),
  delete: (id: number) => del(`/particular-services/${id}`),
  togglePublish: (id: number) => patch(`/particular-services/${id}/toggle-publish`, {}),
}; 