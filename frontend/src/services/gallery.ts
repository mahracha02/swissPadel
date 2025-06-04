import { get, post, put, del, patch } from './api';

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  published: boolean;
}

export const galleryService = {
  getAll: () => get('/gallery'),
  create: (data: Omit<GalleryItem, 'id'>) => post('/gallery', data),
  update: (id: number, data: Partial<GalleryItem>) => put(`/gallery/${id}`, data),
  delete: (id: number) => del(`/gallery/${id}`),
  togglePublish: (id: number) => patch(`/gallery/${id}/toggle-publish`, {}),
}; 