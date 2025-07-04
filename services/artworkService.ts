// services/artworkService.ts
import api from './authService';
import {ArtworkResponse} from '../types/artwork'

export const artworkService = {
  // Create new artwork with images
  createArtwork: async (artworkData: FormData): Promise<ArtworkResponse> => {
    const response = await api.post<ArtworkResponse>('/artwork', artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all artworks
  getAllArtworks: async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sold?: boolean;
}): Promise<{ artworks: ArtworkResponse[]; total: number; page: number; totalPages: number }> => {
  console.log('Requesting artworks with params:', params);
  const response = await api.get('/artwork', { params });
  console.log('Response:', response.data);
  return response.data;
},

  // Get single artwork by ID
  getArtworkById: async (id: string): Promise<ArtworkResponse> => {
    const response = await api.get<ArtworkResponse>(`/artwork/${id}`);
    return response.data;
  },

  // Update artwork with optional new images
  updateArtwork: async (id: string, artworkData: FormData): Promise<ArtworkResponse> => {
    const response = await api.put<ArtworkResponse>(`/artwork/${id}`, artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete artwork
  deleteArtwork: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/artwork/${id}`);
    return response.data;
  },

  // Add images to existing artwork
  addImagesToArtwork: async (id: string, images: FormData): Promise<{
    message: string;
    addedImages: ImageData[];
    artwork: ArtworkResponse;
  }> => {
    const response = await api.post(`/artwork/${id}/images`, images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeImageFromArtwork: async (artworkId: string, publicId: string): Promise<{
    message: string;
    removedImageId: string;
    artwork: ArtworkResponse;
  }> => {
    const encodedPublicId = publicId.replace(/\//g, '--');
    const response = await api.delete(`/artwork/${artworkId}/images/${encodedPublicId}`);
    return response.data;
  },
  setPrimaryImage: async (artworkId: string, publicId: string): Promise<{
    message: string;
    primaryImageId: string;
    artwork: ArtworkResponse;
  }> => {
    const encodedPublicId = publicId.replace(/\//g, '--');
    const response = await api.put(`/artwork/${artworkId}/images/${encodedPublicId}/primary`);
    return response.data;
  },
  getArtworkImages: async (id: string): Promise<{
    message: string;
    images: ImageData[];
    primaryImage: ImageData | null;
    count: number;
  }> => {
    const response = await api.get(`/artwork/${id}/images`);
    return response.data;
  },
  // Get featured artworks
  getFeaturedArtworks: async (): Promise<ArtworkResponse[]> => {
    const response = await api.get('/artwork?featured=true');
    return response.data.artworks;
  },

  // Get artworks by category
  getArtworksByCategory: async (category: string): Promise<ArtworkResponse[]> => {
    const response = await api.get(`/artwork?category=${category}`);
    return response.data.artworks;
  },

  // Search artworks
  searchArtworks: async (query: string): Promise<ArtworkResponse[]> => {
    const response = await api.get(`/artwork/search?q=${encodeURIComponent(query)}`);
    return response.data.artworks;
  },
};