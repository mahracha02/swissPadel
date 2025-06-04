import { get, post, put, del, patch } from './api';

export interface ProfessionalService {
  id: number;
  title: string;
  description: string;
  image: string;
  published: boolean;
}

export const professionalServicesService = {
  getAll: () => get('/professional-services'),
  create: (data: Omit<ProfessionalService, 'id'>) => post('/professional-services', data),
  update: (id: number, data: Partial<ProfessionalService>) => put(`/professional-services/${id}`, data),
  delete: (id: number) => del(`/professional-services/${id}`),
  togglePublish: (id: number) => patch(`/professional-services/${id}/toggle-publish`, {}),
}; 