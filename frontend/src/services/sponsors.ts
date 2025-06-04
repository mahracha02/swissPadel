import { get, post, put, del, patch } from './api';

export interface Sponsor {
  id: number;
  name: string;
  description: string;
  image?: string;
  siteUrl: string;
  published: boolean;
}

export const sponsorsService = {
  getAll: () => get('/sponsors'),
  create: (data: Omit<Sponsor, 'id'>) => post('/sponsors', data),
  update: (id: number, data: Partial<Sponsor>) => put(`/sponsors/${id}`, data),
  delete: (id: number) => del(`/sponsors/${id}`),
  togglePublish: (id: number) => patch(`/sponsors/${id}/toggle-publish`, {}),
}; 