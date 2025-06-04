import { API_URL } from '../config';

export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  place: string;
  image: string;
  published: boolean;
}

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const response = await fetch(`${API_URL}/admin/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  async create(data: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  async update(id: number, data: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_URL}/admin/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/admin/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },

  async togglePublish(id: number): Promise<Event> {
    const response = await fetch(`${API_URL}/admin/events/${id}/toggle-publish`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle event publish status');
    }
    return response.json();
  },
}; 