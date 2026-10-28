import api from './authService';
import { Exhibition } from '../types/exhibition';

export const exhibitionService = {
  // Public: all exhibitions, newest first
  getAllExhibitions: async (): Promise<Exhibition[]> => {
    const response = await api.get<{ exhibitions: Exhibition[] }>('/exhibitions');
    return response.data.exhibitions;
  },

  // Admin: create (multipart so an image can be attached)
  createExhibition: async (data: FormData): Promise<Exhibition> => {
    const response = await api.post<{ exhibition: Exhibition }>('/exhibitions', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.exhibition;
  },

  // Admin: update, optionally replacing the image
  updateExhibition: async (id: string, data: FormData): Promise<Exhibition> => {
    const response = await api.put<{ exhibition: Exhibition }>(`/exhibitions/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.exhibition;
  },

  // Admin: delete (also removes the image)
  deleteExhibition: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/exhibitions/${id}`);
    return response.data;
  },
};
