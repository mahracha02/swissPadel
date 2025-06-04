import { get, post, put, del, patch } from './api';

export interface Contact {
  id: number;
  fullName: string;
  email: string;
  message: string;
  status: boolean;
  published: boolean;
  object?: {
    id: number;
    type: string;
  };
}

export const contactsService = {
  getAll: () => get('/contacts'),
  create: (data: Omit<Contact, 'id'>) => post('/contacts', data),
  update: (id: number, data: Partial<Contact>) => put(`/contacts/${id}`, data),
  delete: (id: number) => del(`/contacts/${id}`),
  toggleStatus: (id: number) => patch(`/contacts/${id}/toggle-status`, {}),
  togglePublish: (id: number) => patch(`/contacts/${id}/toggle-publish`, {}),
}; 