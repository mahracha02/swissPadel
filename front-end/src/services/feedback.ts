import { get, post, put, del, patch } from './api';

export interface Feedback {
  id: number;
  fullName: string;
  message: string;
  image?: string;
  published: boolean;
}

export const feedbackService = {
  getAll: () => get('/feedback'),
  create: (data: Omit<Feedback, 'id'>) => post('/feedback', data),
  update: (id: number, data: Partial<Feedback>) => put(`/feedback/${id}`, data),
  delete: (id: number) => del(`/feedback/${id}`),
  togglePublish: (id: number) => patch(`/feedback/${id}/toggle-publish`, {}),
}; 